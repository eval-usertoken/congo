var congo = require('../congo');

var collection = {
  find: function(args) {
    var findArgs = arguments;

    return {
      toArray: function(callback) {
        return { findArgs: findArgs, callback: callback };
      }
    };
  }
};

describe('congo', function() {
  describe('createFindAllFunction', function() {
    it('creates a cursor and automatically calls toArray', function() {
      var findAll = congo.createFindAllFunction(collection, collection.find);
      var testData = findAll('arg1', 'arg2', 'arg3', 'callback');

      expect(testData.findArgs[0]).toBe('arg1');
      expect(testData.findArgs[1]).toBe('arg2');
      expect(testData.findArgs[2]).toBe('arg3');
      expect(testData.callback).toBe('callback');
    });
  });
});
