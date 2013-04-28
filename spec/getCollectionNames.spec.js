var congo = require('../congo');

var connection = {
  collectionNames: function(onComplete) {
    return onComplete(null, [
      { name: 'dbname.one', options: { create: 'users' } },
      { name: 'dbname.system.indexes' },
      { name: 'dbname.two', options: { create: 'docs' } },
      { name: 'dbname.db_three' }
    ]);
  }
};

describe('congo', function() {
  describe('getCollectionNames', function() {
    it('parses collection names without database prefix and excludes system collections', function() {
      var names = [];

      runs(function() {
        congo.getCollectionNames(connection, function(err, collectionNames) {
          names = collectionNames;
        });
      });

      waitsFor(function() { return names.length; }, 500);

      runs(function() {
        expect(names).toContain('one');
        expect(names).toContain('two');
        expect(names).toContain('db_three');
        expect(names).not.toContain('indexes');
      });
    });
  });
});
