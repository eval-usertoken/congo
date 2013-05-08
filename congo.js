var Db = require('mongodb').Db;
var Server = require('mongodb').Server;
var async = require('async');
var _ = require('underscore');

var _active_connection;
var _config;
var _events = {};

var parseArguments = function(args) {
  var config = {
    host: 'localhost',
    name: 'test',
    port: 27017,
    reconnect: false,
    pool: 5,
    collections: []
  };

  if (!(args || []).length) return config;

  if (_.isString(args[0]) && _.isString(args[1])) {
    config.host = args[0];
    config.name = args[1];
  }

  if (_.isObject(args[0])) {
    _.extend(config, args[0]);
  }

  return config;
};

var getCollectionNames = function(connection, existing, onComplete) {
  connection.collectionNames(function(err, collections) {
    if (err) return onComplete(err);

    var nonSystemCollections = _.reject(collections, function(collection) {
      return collection.name.match(/.system/g);
    });

    var collectionNames = _.map(nonSystemCollections, function(collection) {
      return collection.name.match(/\.(.*)/i)[1];
    });

    return onComplete(null, _.union(collectionNames, existing));
  });
};

var createFindAllFunction = function(collection, find) {
  return function() {
    var cursor = find.apply(collection, _.initial(arguments, 1));
    return cursor.toArray(_.last(arguments));
  };
};

var attachCollections = function(names, connection, onAttached) {
  async.each(names, function(name, onComplete) {
    connection.collection(name, function(err, collection) {
      if (err) return onComplete(err);

      collection.findAll = createFindAllFunction(collection, collection.find);
      connection[name] = collection;
      return onComplete();
    });
  }, onAttached);
};

var attachEvents = function(db) {
  _.each(_events, function(handler, name) {
    db.on(name, handler);
  });
};

var on = function(name, handler) {
  _events[name] = handler;
};

var configure = function() {
  _config = parseArguments(arguments);
  return _config;
};

var get = function(onComplete) {
  if (!_config) return onComplete('Please call configure first');
  if (_active_connection) return onComplete(null, _active_connection);

  var server = new Server(_config.host, _config.port, { auto_reconnect: _config.reconnect, poolSize: _config.pool });
  var db = new Db(_config.name, server, { safe: true });

  if (!_config.reconnect) {
    db.on('close', function() {
      _active_connection = null;
    });
  }

  attachEvents(db);

  db.open(function(err, connection) {
    if (err) return onComplete(err);

    getCollectionNames(connection, _config.collections, function(err, names) {
      if (err) return onComplete(err);

      attachCollections(names, connection, function(err) {
        _active_connection = connection;
        return onComplete(err, connection);
      });
    });
  });
};

module.exports = {
  configure: configure,
  get: get,
  on: on
};

if (process.env.test) {
  _.extend(module.exports, {
    parseArguments: parseArguments,
    getCollectionNames: getCollectionNames,
    createFindAllFunction: createFindAllFunction,
    attachCollections: attachCollections,
    attachEvents: attachEvents
  });
}
