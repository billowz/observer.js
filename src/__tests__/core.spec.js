import '../shim'
import Observer from '../core'

class AsyncDone {

  constructor(done, onDone) {
    this.done = done;
    this.onDone = onDone;
    this.__async = 0;
  }
  async() {
    this.__async++;
    return () => {
      this.__async--;
      if (!this.__async) {
        if (this.onDone) {
          this.onDone();
        }
        this.done();
      }
    };
  }
}

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
      expect(observe.hasListen()).toEqual(false);
      observe.destroy();
      observe = undefined;
    });

    function assertName(attr, val, oldVal, target) {
      expect(attr).toEqual('name');
      expect(val).toEqual('Tao.Zeng');
      expect(obj.name).toEqual(val);
      expect(oldVal).toEqual('Mary');
      observe.un('name');
    }

    function assertEmail(attr, val, oldVal, target) {
      expect(attr).toEqual('email');
      expect(val).toEqual('tao.zeng.zt@gmail.com');
      expect(obj.email).toEqual(val);
      expect(oldVal).toEqual('mary@domain.com');
      observe.un('email');
    }

    it("Observe non-changes on an object property", function(done) {
      let handler = jasmine.createSpy('handler');

      obj.name = 'Tao.Zeng';

      obj = observe.on('name', handler);
      obj.name = 'Tao.Zeng';
      setTimeout(() => {
        expect(handler).not.toHaveBeenCalled();
        observe.un();
        done();
      }, 100);
    }, 1000);

    it("Observe changes on an object property", function(done) {
      let async = new AsyncDone(done),
        done1 = async.async(),
        done2 = async.async();

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
      expect(() => {
        observe.on('name');
      }).toThrowError('Invalid Parameter');
      expect(() => {
        observe.on('name', null);
      }).toThrowError('Invalid Observer Handler');
    }, 1000);

    it("Observe changes on multi object property", function(done) {
      let async = new AsyncDone(done),
        done1 = async.async(),
        done2 = async.async();

      obj = observe.on('name', 'email', (attr, val, oldVal, target) => {
        if (attr === 'name') {
          assertName(attr, val, oldVal, target);
          done1();
        } else if (attr === 'email') {
          assertEmail(attr, val, oldVal, target);
          done2();
        } else
          fail('invalid event');
      });

      obj.name = 'Tao.Zeng';
      obj.email = 'tao.zeng.zt@gmail.com';
      expect(() => {
        observe.on('name', 'email');
      }).toThrowError('Invalid Observer Handler');
    }, 1000);

    it("Observe changes on multi-array object property", function(done) {
      let async = new AsyncDone(done),
        done1 = async.async(),
        done2 = async.async();

      obj = observe.on(['name', 'email'], (attr, val, oldVal, target) => {
        if (attr === 'name') {
          assertName(attr, val, oldVal, target);
          done1();
        } else if (attr === 'email') {
          assertEmail(attr, val, oldVal, target);
          done2();
        } else
          fail('invalid event');
      });

      obj.name = 'Tao.Zeng';
      obj.email = 'tao.zeng.zt@gmail.com';
      expect(() => {
        observe.on(['name', 'email']);
      }).toThrowError('Invalid Observer Handler');
    }, 1000);

    it("Observe changes on multi-object object property", function(done) {
      let async = new AsyncDone(done),
        done1 = async.async(),
        done2 = async.async();

      obj = observe.on({
        name: (attr, val, oldVal, target) => {
          assertName(attr, val, oldVal, target);
          done1();
        },
        email: (attr, val, oldVal, target) => {
          assertEmail(attr, val, oldVal, target);
          done2();
        }
      });

      obj.name = 'Tao.Zeng';
      obj.email = 'tao.zeng.zt@gmail.com';
      expect(() => {
        observe.on({
          name: undefined
        });
      }).toThrowError('Invalid Observer Handler');
    }, 1000);

    it("Observe changes on all object property", function(done) {
      let async = new AsyncDone(done),
        done1 = async.async(),
        done2 = async.async();

      obj = observe.on((attr, val, oldVal, target) => {
        if (attr === 'name') {
          assertName(attr, val, oldVal, target);
          done1();
        } else if (attr === 'email') {
          assertEmail(attr, val, oldVal, target);
          done2();
        } else
          fail('invalid event');
      });

      obj.name = 'Tao.Zeng';
      obj.email = 'tao.zeng.zt@gmail.com';
    }, 1000);

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
      let handler = jasmine.createSpy('handler');

      arr = observe.on(0, 5, handler);
      arr[5] = undefined;
      arr[0] = 'javascript';
      setTimeout(() => {
        expect(handler).not.toHaveBeenCalled();
        observe.un();
        done();
      }, 500);
    }, 1000);


    it("Observe changes on array index", function(done) {
      let handler = jasmine.createSpy('handler');
      let handler2 = jasmine.createSpy('handler2');

      arr = observe.on({
        0: handler,
        5: handler2
      });
      arr[0] = 'abc';
      arr[5] = 'abc';
      setTimeout(() => {
        expect(handler).toHaveBeenCalledWith('0', 'abc', 'javascript', arr);
        expect(handler2).toHaveBeenCalledWith('5', 'abc', undefined, arr);
        observe.un();
        done();
      }, 500);
    }, 1000);

    it("Observe changes on array length by set", function(done) {
      let handler = jasmine.createSpy('handler');

      arr = observe.on('length', handler);
      arr[0] = 'abc';
      arr[5] = 'abc';
      setTimeout(() => {
        expect(handler).toHaveBeenCalledWith('length', 6, 3, arr);
        observe.un();
        done();
      }, 500);
    }, 1000);

    it("Observe changes on array length by push", function(done) {
      let handler = jasmine.createSpy('handler');

      arr = observe.on('length', handler);
      arr[0] = 'abc';
      arr.push(123);
      setTimeout(() => {
        expect(handler).toHaveBeenCalledWith('length', 4, 3, arr);
        observe.un();
        done();
      }, 500);
    }, 1000);
    it("Observe changes on array length by splice", function(done) {
      let handler = jasmine.createSpy('handler');

      arr = observe.on('length', handler);
      arr[0] = 'abc';
      arr.splice(0, 2);
      setTimeout(() => {
        expect(handler).toHaveBeenCalledWith('length', 1, 3, arr);
        observe.un();
        done();
      }, 500);
    }, 1000);
  });

});
