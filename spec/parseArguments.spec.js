var congo = require('../congo');

describe('congo', function() {
  describe('parseArguments', function() {
    it('defaults to localhost/test when incorrect arguments are used', function() {
      var config = congo.parseArguments();

      expect(config.host).toBe('localhost');
      expect(config.name).toBe('test');
    });

    it('supports two string arguments representing host and db', function() {
      var config = congo.parseArguments(['1.2.3.4', 'dbname', function() {}]);

      expect(config.host).toBe('1.2.3.4');
      expect(config.name).toBe('dbname');
    });

    it('supports single object argument representing all values', function() {
      var args = {
        host: '1.2.3.4',
        name: 'dbname',
        port: 12345,
        reconnect: false,
        pool: 42,
      };

      var config = congo.parseArguments([args, function() {}]);

      expect(config.host).toBe(args.host);
      expect(config.name).toBe(args.name);
      expect(config.port).toBe(args.port);
      expect(config.reconnect).toBe(args.reconnect);
      expect(config.pool).toBe(args.pool);
    });
  });
});
