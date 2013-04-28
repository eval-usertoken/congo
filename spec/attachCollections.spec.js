var congo = require('../congo');

var connection = {
  collection: function(name, onComplete) {
    return onComplete(null, { attached: true });
  }
};

describe('congo', function() {
  describe('attachCollections', function() {
    it('attaches all non-system collections to the connection object', function() {
      var attached = false;

      runs(function() {
        congo.attachCollections(['one', 'two', 'db_three'], connection, function() {
          attached = true;
        });
      });

      waitsFor(function() { return attached; }, 500);

      runs(function() {
        expect(connection.one.attached).toBe(true);
        expect(connection.two.attached).toBe(true);
        expect(connection.db_three.attached).toBe(true);

        expect(typeof connection.one.findAll).toBe('function');
        expect(typeof connection.two.findAll).toBe('function');
        expect(typeof connection.db_three.findAll).toBe('function');
      });
    });
  });
});
