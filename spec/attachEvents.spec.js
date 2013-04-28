var congo = require('../congo');

var db = {
  on: function(name, handler) {
    this[name] = handler;
  }
};

describe('congo', function() {
  describe('attachEvents', function() {
    it('attaches all user subscribed events to the db object', function() {
      congo.on('event1', 'eventhandler1');
      congo.on('event2', 'eventhandler2');
      congo.on('event3', 'eventhandler3');
      congo.attachEvents(db);

      expect(db['event1']).toBe('eventhandler1');
      expect(db['event2']).toBe('eventhandler2');
      expect(db['event3']).toBe('eventhandler3');
    });
  });
});
