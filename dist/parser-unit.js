'use strict';

var _parser = require('./parser');

var _parser2 = _interopRequireDefault(_parser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('smtpclient response parser unit tests', function () {
  var parser;

  beforeEach(function () {
    parser = new _parser2.default();
  });

  afterEach(function () {});

  describe('#send', function () {
    it('should emit error on closed parser', function () {
      sinon.stub(parser, 'onerror');

      parser.destroyed = true;
      parser.send('abc');

      expect(parser.onerror.callCount).to.equal(1);
      expect(parser.onerror.args[0][0] instanceof Error).to.be.true;

      parser.onerror.restore();
    });

    it('should process sent lines', function () {
      sinon.stub(parser, '_processLine');

      parser._remainder = 'a';
      parser.send('bc\r\ndef\nghi');

      expect(parser._processLine.callCount).to.equal(2);
      expect(parser._processLine.args[0][0]).to.equal('abc');
      expect(parser._processLine.args[1][0]).to.equal('def');
      expect(parser._remainder).to.equal('ghi');

      parser._processLine.restore();
    });
  });

  describe('#end', function () {
    it('should emit error on closed parser', function () {
      sinon.stub(parser, 'onerror');

      parser.destroyed = true;
      parser.end();

      expect(parser.onerror.callCount).to.equal(1);
      expect(parser.onerror.args[0][0] instanceof Error).to.be.true;

      parser.onerror.restore();
    });

    it('process the remainder and emit onend', function () {
      sinon.stub(parser, '_processLine');
      sinon.stub(parser, 'onend');

      parser._remainder = 'abc';
      parser.end();

      expect(parser._processLine.withArgs('abc').callCount).to.equal(1);
      expect(parser.onend.callCount).to.equal(1);

      parser._processLine.restore();
      parser.onend.restore();
    });
  });

  describe('#_processLine', function () {
    it('should parse and emit a single line response', function () {
      sinon.stub(parser, 'ondata');

      parser._processLine('250 1.1.1 Ok');
      expect(parser.ondata.withArgs({
        statusCode: 250,
        enhancedStatus: '1.1.1',
        data: 'Ok',
        line: '250 1.1.1 Ok',
        success: true
      }).callCount).to.equal(1);

      parser.ondata.restore();
    });

    it('should parse and emit a multi line response', function () {
      sinon.stub(parser, 'ondata');

      parser._processLine('250-Ok 1');
      parser._processLine('250-Ok 2');
      parser._processLine('250 Ok 3');

      expect(parser.ondata.withArgs({
        statusCode: 250,
        enhancedStatus: null,
        data: 'Ok 1\nOk 2\nOk 3',
        line: '250-Ok 1\n250-Ok 2\n250 Ok 3',
        success: true
      }).callCount).to.equal(1);

      parser.ondata.restore();
    });

    it('should emit an error on invalid input', function () {
      sinon.stub(parser, 'onerror');

      parser._processLine('zzzz');

      expect(parser.onerror.callCount).to.equal(1);
      expect(parser.onerror.args[0][0] instanceof Error).to.be.true;

      parser.onerror.restore();
    });
  });
}); /* eslint-disable no-unused-expressions */
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJzZXItdW5pdC5qcyJdLCJuYW1lcyI6WyJkZXNjcmliZSIsInBhcnNlciIsImJlZm9yZUVhY2giLCJhZnRlckVhY2giLCJpdCIsInNpbm9uIiwic3R1YiIsImRlc3Ryb3llZCIsInNlbmQiLCJleHBlY3QiLCJvbmVycm9yIiwiY2FsbENvdW50IiwidG8iLCJlcXVhbCIsImFyZ3MiLCJFcnJvciIsImJlIiwidHJ1ZSIsInJlc3RvcmUiLCJfcmVtYWluZGVyIiwiX3Byb2Nlc3NMaW5lIiwiZW5kIiwid2l0aEFyZ3MiLCJvbmVuZCIsIm9uZGF0YSIsInN0YXR1c0NvZGUiLCJlbmhhbmNlZFN0YXR1cyIsImRhdGEiLCJsaW5lIiwic3VjY2VzcyJdLCJtYXBwaW5ncyI6Ijs7QUFFQTs7Ozs7O0FBRUFBLFNBQVMsdUNBQVQsRUFBa0QsWUFBWTtBQUM1RCxNQUFJQyxNQUFKOztBQUVBQyxhQUFXLFlBQVk7QUFDckJELGFBQVMsc0JBQVQ7QUFDRCxHQUZEOztBQUlBRSxZQUFVLFlBQVksQ0FBRyxDQUF6Qjs7QUFFQUgsV0FBUyxPQUFULEVBQWtCLFlBQVk7QUFDNUJJLE9BQUcsb0NBQUgsRUFBeUMsWUFBWTtBQUNuREMsWUFBTUMsSUFBTixDQUFXTCxNQUFYLEVBQW1CLFNBQW5COztBQUVBQSxhQUFPTSxTQUFQLEdBQW1CLElBQW5CO0FBQ0FOLGFBQU9PLElBQVAsQ0FBWSxLQUFaOztBQUVBQyxhQUFPUixPQUFPUyxPQUFQLENBQWVDLFNBQXRCLEVBQWlDQyxFQUFqQyxDQUFvQ0MsS0FBcEMsQ0FBMEMsQ0FBMUM7QUFDQUosYUFBT1IsT0FBT1MsT0FBUCxDQUFlSSxJQUFmLENBQW9CLENBQXBCLEVBQXVCLENBQXZCLGFBQXFDQyxLQUE1QyxFQUFtREgsRUFBbkQsQ0FBc0RJLEVBQXRELENBQXlEQyxJQUF6RDs7QUFFQWhCLGFBQU9TLE9BQVAsQ0FBZVEsT0FBZjtBQUNELEtBVkQ7O0FBWUFkLE9BQUcsMkJBQUgsRUFBZ0MsWUFBWTtBQUMxQ0MsWUFB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Qjs7QUFFQVgsYUFBT1IsT0FBT3VCLE1BQVAsQ0FBY0YsUUFBZCxDQUF1QjtBQUM1Qkcsb0JBQVksR0FEZ0I7QUFFNUJDLHdCQUFnQixJQUZZO0FBRzVCQyxjQUFNLGtCQUhzQjtBQUk1QkMsY0FBTSw4QkFKc0I7QUFLNUJDLGlCQUFTO0FBTG1CLE9BQXZCLEVBTUpsQixTQU5ILEVBTWNDLEVBTmQsQ0FNaUJDLEtBTmpCLENBTXVCLENBTnZCOztBQVFBWixhQUFPdUIsTUFBUCxDQUFjTixPQUFkO0FBQ0QsS0FoQkQ7O0FBa0JBZCxPQUFHLHVDQUFILEVBQTRDLFlBQVk7QUFDdERDLFlBQU1DLElBQU4sQ0FBV0wsTUFBWCxFQUFtQixTQUFuQjs7QUFFQUEsYUFBT21CLFlBQVAsQ0FBb0IsTUFBcEI7O0FBRUFYLGFBQU9SLE9BQU9TLE9BQVAsQ0FBZUMsU0FBdEIsRUFBaUNDLEVBQWpDLENBQW9DQyxLQUFwQyxDQUEwQyxDQUExQztBQUNBSixhQUFPUixPQUFPUyxPQUFQLENBQWVJLElBQWYsQ0FBb0IsQ0FBcEIsRUFBdUIsQ0FBdkIsYUFBcUNDLEtBQTVDLEVBQW1ESCxFQUFuRCxDQUFzREksRUFBdEQsQ0FBeURDLElBQXpEOztBQUVBaEIsYUFBT1MsT0FBUCxDQUFlUSxPQUFmO0FBQ0QsS0FURDtBQVVELEdBNUNEO0FBNkNELENBOUdELEUsQ0FKQSIsImZpbGUiOiJwYXJzZXItdW5pdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC1leHByZXNzaW9ucyAqL1xuXG5pbXBvcnQgU210cFJlc3BvbnNlUGFyc2VyIGZyb20gJy4vcGFyc2VyJ1xuXG5kZXNjcmliZSgnc210cGNsaWVudCByZXNwb25zZSBwYXJzZXIgdW5pdCB0ZXN0cycsIGZ1bmN0aW9uICgpIHtcbiAgdmFyIHBhcnNlclxuXG4gIGJlZm9yZUVhY2goZnVuY3Rpb24gKCkge1xuICAgIHBhcnNlciA9IG5ldyBTbXRwUmVzcG9uc2VQYXJzZXIoKVxuICB9KVxuXG4gIGFmdGVyRWFjaChmdW5jdGlvbiAoKSB7IH0pXG5cbiAgZGVzY3JpYmUoJyNzZW5kJywgZnVuY3Rpb24gKCkge1xuICAgIGl0KCdzaG91bGQgZW1pdCBlcnJvciBvbiBjbG9zZWQgcGFyc2VyJywgZnVuY3Rpb24gKCkge1xuICAgICAgc2lub24uc3R1YihwYXJzZXIsICdvbmVycm9yJylcblxuICAgICAgcGFyc2VyLmRlc3Ryb3llZCA9IHRydWVcbiAgICAgIHBhcnNlci5zZW5kKCdhYmMnKVxuXG4gICAgICBleHBlY3QocGFyc2VyLm9uZXJyb3IuY2FsbENvdW50KS50by5lcXVhbCgxKVxuICAgICAgZXhwZWN0KHBhcnNlci5vbmVycm9yLmFyZ3NbMF1bMF0gaW5zdGFuY2VvZiBFcnJvcikudG8uYmUudHJ1ZVxuXG4gICAgICBwYXJzZXIub25lcnJvci5yZXN0b3JlKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwcm9jZXNzIHNlbnQgbGluZXMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBzaW5vbi5zdHViKHBhcnNlciwgJ19wcm9jZXNzTGluZScpXG5cbiAgICAgIHBhcnNlci5fcmVtYWluZGVyID0gJ2EnXG4gICAgICBwYXJzZXIuc2VuZCgnYmNcXHJcXG5kZWZcXG5naGknKVxuXG4gICAgICBleHBlY3QocGFyc2VyLl9wcm9jZXNzTGluZS5jYWxsQ291bnQpLnRvLmVxdWFsKDIpXG4gICAgICBleHBlY3QocGFyc2VyLl9wcm9jZXNzTGluZS5hcmdzWzBdWzBdKS50by5lcXVhbCgnYWJjJylcbiAgICAgIGV4cGVjdChwYXJzZXIuX3Byb2Nlc3NMaW5lLmFyZ3NbMV1bMF0pLnRvLmVxdWFsKCdkZWYnKVxuICAgICAgZXhwZWN0KHBhcnNlci5fcmVtYWluZGVyKS50by5lcXVhbCgnZ2hpJylcblxuICAgICAgcGFyc2VyLl9wcm9jZXNzTGluZS5yZXN0b3JlKClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCcjZW5kJywgZnVuY3Rpb24gKCkge1xuICAgIGl0KCdzaG91bGQgZW1pdCBlcnJvciBvbiBjbG9zZWQgcGFyc2VyJywgZnVuY3Rpb24gKCkge1xuICAgICAgc2lub24uc3R1YihwYXJzZXIsICdvbmVycm9yJylcblxuICAgICAgcGFyc2VyLmRlc3Ryb3llZCA9IHRydWVcbiAgICAgIHBhcnNlci5lbmQoKVxuXG4gICAgICBleHBlY3QocGFyc2VyLm9uZXJyb3IuY2FsbENvdW50KS50by5lcXVhbCgxKVxuICAgICAgZXhwZWN0KHBhcnNlci5vbmVycm9yLmFyZ3NbMF1bMF0gaW5zdGFuY2VvZiBFcnJvcikudG8uYmUudHJ1ZVxuXG4gICAgICBwYXJzZXIub25lcnJvci5yZXN0b3JlKClcbiAgICB9KVxuXG4gICAgaXQoJ3Byb2Nlc3MgdGhlIHJlbWFpbmRlciBhbmQgZW1pdCBvbmVuZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHNpbm9uLnN0dWIocGFyc2VyLCAnX3Byb2Nlc3NMaW5lJylcbiAgICAgIHNpbm9uLnN0dWIocGFyc2VyLCAnb25lbmQnKVxuXG4gICAgICBwYXJzZXIuX3JlbWFpbmRlciA9ICdhYmMnXG4gICAgICBwYXJzZXIuZW5kKClcblxuICAgICAgZXhwZWN0KHBhcnNlci5fcHJvY2Vzc0xpbmUud2l0aEFyZ3MoJ2FiYycpLmNhbGxDb3VudCkudG8uZXF1YWwoMSlcbiAgICAgIGV4cGVjdChwYXJzZXIub25lbmQuY2FsbENvdW50KS50by5lcXVhbCgxKVxuXG4gICAgICBwYXJzZXIuX3Byb2Nlc3NMaW5lLnJlc3RvcmUoKVxuICAgICAgcGFyc2VyLm9uZW5kLnJlc3RvcmUoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJyNfcHJvY2Vzc0xpbmUnLCBmdW5jdGlvbiAoKSB7XG4gICAgaXQoJ3Nob3VsZCBwYXJzZSBhbmQgZW1pdCBhIHNpbmdsZSBsaW5lIHJlc3BvbnNlJywgZnVuY3Rpb24gKCkge1xuICAgICAgc2lub24uc3R1YihwYXJzZXIsICdvbmRhdGEnKVxuXG4gICAgICBwYXJzZXIuX3Byb2Nlc3NMaW5lKCcyNTAgMS4xLjEgT2snKVxuICAgICAgZXhwZWN0KHBhcnNlci5vbmRhdGEud2l0aEFyZ3Moe1xuICAgICAgICBzdGF0dXNDb2RlOiAyNTAsXG4gICAgICAgIGVuaGFuY2VkU3RhdHVzOiAnMS4xLjEnLFxuICAgICAgICBkYXRhOiAnT2snLFxuICAgICAgICBsaW5lOiAnMjUwIDEuMS4xIE9rJyxcbiAgICAgICAgc3VjY2VzczogdHJ1ZVxuICAgICAgfSkuY2FsbENvdW50KS50by5lcXVhbCgxKVxuXG4gICAgICBwYXJzZXIub25kYXRhLnJlc3RvcmUoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHBhcnNlIGFuZCBlbWl0IGEgbXVsdGkgbGluZSByZXNwb25zZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHNpbm9uLnN0dWIocGFyc2VyLCAnb25kYXRhJylcblxuICAgICAgcGFyc2VyLl9wcm9jZXNzTGluZSgnMjUwLU9rIDEnKVxuICAgICAgcGFyc2VyLl9wcm9jZXNzTGluZSgnMjUwLU9rIDInKVxuICAgICAgcGFyc2VyLl9wcm9jZXNzTGluZSgnMjUwIE9rIDMnKVxuXG4gICAgICBleHBlY3QocGFyc2VyLm9uZGF0YS53aXRoQXJncyh7XG4gICAgICAgIHN0YXR1c0NvZGU6IDI1MCxcbiAgICAgICAgZW5oYW5jZWRTdGF0dXM6IG51bGwsXG4gICAgICAgIGRhdGE6ICdPayAxXFxuT2sgMlxcbk9rIDMnLFxuICAgICAgICBsaW5lOiAnMjUwLU9rIDFcXG4yNTAtT2sgMlxcbjI1MCBPayAzJyxcbiAgICAgICAgc3VjY2VzczogdHJ1ZVxuICAgICAgfSkuY2FsbENvdW50KS50by5lcXVhbCgxKVxuXG4gICAgICBwYXJzZXIub25kYXRhLnJlc3RvcmUoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGVtaXQgYW4gZXJyb3Igb24gaW52YWxpZCBpbnB1dCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHNpbm9uLnN0dWIocGFyc2VyLCAnb25lcnJvcicpXG5cbiAgICAgIHBhcnNlci5fcHJvY2Vzc0xpbmUoJ3p6enonKVxuXG4gICAgICBleHBlY3QocGFyc2VyLm9uZXJyb3IuY2FsbENvdW50KS50by5lcXVhbCgxKVxuICAgICAgZXhwZWN0KHBhcnNlci5vbmVycm9yLmFyZ3NbMF1bMF0gaW5zdGFuY2VvZiBFcnJvcikudG8uYmUudHJ1ZVxuXG4gICAgICBwYXJzZXIub25lcnJvci5yZXN0b3JlKClcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==