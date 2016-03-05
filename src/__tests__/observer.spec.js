const observer = require('../index');
require('./test');

describe("Observer factory", () => {
  it("Observe changes", function(done) {
    var obj = {
      a: {
        b: {
          c: 123
        }
      }
    };
    obj = observer.on(obj, 'a.b.c', function() {
      expect(Array.prototype.slice.call(arguments)).eql(['a.b.c', 'abc', 123, obj]);
      expect(observer.hasListen(obj, 'a.b.c')).equal(true);
      observer.un(obj, 'a.b.c');
      expect(observer.hasListen(obj)).equal(false);
      done();
    });
    expect(observer.hasListen(obj, 'a.b.c')).equal(true);
    obj.a.b.c = 'abc';
  });

});
