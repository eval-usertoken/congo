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
