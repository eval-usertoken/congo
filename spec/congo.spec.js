var congo = require('../congo');

describe('congo', function() {
  describe('public interface', function() {
    it('exposes a configure function', function() {
      expect(congo.configure).toBeDefined();
    });

    it('exposes an on function', function() {
      expect(congo.on).toBeDefined();
    });

    it('exposes a get function', function() {
      expect(congo.get).toBeDefined();
    });

    it('exposes an ObjectID function from mongo', function() {
      expect(congo.ObjectID).toBeDefined();
    });

    it('exposes a BSON function from mongo', function() {
      expect(congo.BSON).toBeDefined();
    });

    it('exposes a DBRef function from mongo', function() {
      expect(congo.DBRef).toBeDefined();
    });

    it('detects missing configure call', function() {
      var error = null;

      runs(function() {
        congo.get(function(err) { error = err; });
      });

      waitsFor(function() { return error; }, 500);

      runs(function() {
        expect(error).toMatch(/configure/g);
      });
    });
  });
});
