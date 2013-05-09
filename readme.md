# congo.js

Congo is a thin wrapper for [node-mongodb-native](https://github.com/mongodb/node-mongodb-native) that makes connections and collections a little easier.

## Installation

```
npm install https://github.com/martinrue/congo/tarball/master
```

## Configuration

The first thing you must do is call `configure` to tell congo where the database is and various other options about how the database connection should be made.

### Simple

```javascript
var database = require('congo');

database.configure('localhost', 'mydb');
```

### Full

```javascript
var database = require('congo');

var config = {
  host: 'localhost',
  name: 'mydb',
  port: 27017,
  reconnect: true,
  pool: 10
};

database.configure(config);
```

## Querying

### Get Database

After the call to `configure`, call `get` to retrieve a database object.

```javascript
database.get(function(err, db) {
  // db is a connected database object
});
```

### Collections

Congo attaches any non-system collections directly onto the database object for you, so querying a collection is as simple as:

```javascript
database.get(function(err, db) {
  db.users.findOne({}, function(err, user) {
    
  });
});
```

For convenience, congo also attaches a new `findAll` function to each collection object. This allows you to avoid having to deal with the cursor if you simply want to retrieve all results from a multi-result query:

```javascript
database.get(function(err, db) {
  db.users.findAll({}, function(err, users) {
    // users is an array of all users from the database
  });
});
```

### New Collections

Because congo queries all existing collections and attaches them to the database object, any new collections you intend to create won't have a corresponding `db.[collection]`. For this reason, you can supply an array of collections in the config that are always mapped onto the database object:

```javascript
var database = require('congo');

var config = {
  host: 'localhost',
  name: 'mydb',
  port: 27017,
  reconnect: true,
  pool: 10,
  collections: ['users', 'products', 'orders']
};

database.configure(config);

database.get(function(err, db) {
  // db.users, db.products and db.orders will all be available, 
  // irrespective of whether they existed in the database or not
});
```

### Connections

Congo forms one pooled database connection internally and reuses it. This means you can call `get` anywhere and not worry about creating unnecessary additional connections.

If `reconnect: true` is set on the configuration object, the mongo driver will reconnect automatically and this also queues commands and replays them once connections are reestablished. 

If `reconnect: false` is set (the default), congo itself reconnects closed connections on each `get` call and does not queue any failed commands.

### Events

Congo propogates events that occur on the database such as `'close'` and `'error'`. You can listen to these by passing a callback to the `on` function:

```javascript
database.on('close', function() {
  // database connection was closed
});

database.on('error', function() {
  // error occurred on the database
});
```
