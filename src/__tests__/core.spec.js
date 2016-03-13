const Observer = require('../core'),
  _ = require('../util');
require('./test');


describe("Observer", () => {

  describe('Observer changes on Object', () => {
    let obj, observe;

    beforeEach(() => {
      obj = {
        name: 'Mary',
        email: 'mary@domain.com'
      };
      observe = new Observer(obj);
    });

    afterEach(() => {
      observe.destroy();
      observe = undefined;
    });

    function assertName(attr, val, oldVal, target) {
      expect(attr).equal('name');
      expect(val).equal('Tao.Zeng');
      expect(obj.name).equal(val);
      expect(oldVal).equal('Mary');
      observe.un('name');
    }

    function assertEmail(attr, val, oldVal, target) {
      expect(attr).equal('email');
      expect(val).equal('tao.zeng.zt@gmail.com');
      expect(obj.email).equal(val);
      expect(oldVal).equal('mary@domain.com');
      observe.un('email');
    }

    it("Observe non-changes on an object property", function(done) {
      let handler = () => {
        expect().fail();
      };

      obj.name = 'Tao.Zeng';

      obj = observe.on('name', handler);
      obj.name = 'Tao.Zeng';
      setTimeout(() => {
        done();
      }, 500);
    });

    it("Observe changes on an object property", function(done) {
      let async = new AsyncDone(done),
        done1 = async.async(),
        done2 = async.async();

      expect(() => {
        observe.on('name');
      }).to.throwError('Invalid Observer Handler');

      expect(() => {
        observe.on('name', null);
      }).to.throwError('Invalid Observer Handler');

      obj = observe.on('name', (attr, val, oldVal, target) => {
        assertName(attr, val, oldVal, target);
        done1();
      });
      obj = observe.on('email', (attr, val, oldVal, target) => {
        assertEmail(attr, val, oldVal, target);
        done2();
      });
      obj.name = 'Tao.Zeng';
      obj.email = 'tao.zeng.zt@gmail.com';
    });
  });

  describe('Observer changes on Array', () => {
    let arr, observe;
    beforeEach(() => {
      arr = ['javascript', 'java', 'c'];
      observe = new Observer(arr);
    });
    afterEach(() => {
      observe.destroy();
      observe = undefined;
    });

    it("Observe non-changes on array index", function(done) {
      let handler = () => {
        expect().fail();
      };

      arr = observe.on(0, handler);
      arr = observe.on(2, handler);
      arr[2] = 'c';
      arr[0] = 'javascript';
      setTimeout(() => {
        done();
      }, 800);
    });


    it("Observe changes on array index", function(done) {
      let async = new AsyncDone(done, _.bind.call(observe.un, observe)),
        done1 = async.async(),
        done2 = async.async();

      function handler() {
        expect(Array.prototype.slice.call(arguments)).eql(['0', 'abc', 'javascript', arr]);
        done1();
      }

      function handler2() {
        expect(Array.prototype.slice.call(arguments)).eql(['2', 'abc', 'c', arr]);
        done2();
      }

      arr = observe.on(0, handler);
      arr = observe.on(2, handler2);
      arr[0] = 'abc';
      arr[2] = 'abc';
    });

    xit("Observe changes on array length by set(just work on Object.observe)", function(done) {
      function handler() {
        expect(Array.prototype.slice.call(arguments)).eql(['length', 6, 3, arr]);
        done();
      }

      arr = observe.on('length', handler);
      arr[0] = 'abc';
      arr[5] = 'abc';
    }, 1000);

    it("Observe changes on array length by push", function(done) {
      function handler() {
        expect(Array.prototype.slice.call(arguments)).eql(['length', 4, 3, arr]);
        done();
      }

      arr = observe.on('length', handler);
      arr[0] = 'abc';
      arr.push(123);
    }, 1000);
    it("Observe changes on array length by splice", function(done) {
      function handler() {
        expect(Array.prototype.slice.call(arguments)).eql(['length', 1, 3, arr]);
        done();
      }

      arr = observe.on('length', handler);
      arr[0] = 'abc';
      arr.splice(0, 2);
    }, 1000);
  });

});
