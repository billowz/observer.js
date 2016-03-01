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

describe("Observer Test Case", () => {
  it("Observe changes on an object property", function(done) {
    let obj = {
        name: 'Mary',
        email: 'mary@domain.com'
      },
      observe = new Observer(obj),
      async = new AsyncDone(done, () => {
        expect(observe.hasListen()).toEqual(false);
      }),
      done1 = async.async(),
      done2 = async.async();

    obj = observe.on('name', (attr, val, oldVal, target) => {
      expect(attr).toEqual('name');
      expect(val).toEqual('Tao.Zeng');
      expect(obj.name).toEqual(val);
      expect(oldVal).toEqual('Mary');
      observe.un('name');
      done1();
    });
    obj = observe.on('email', (attr, val, oldVal, target) => {
      expect(attr).toEqual('email');
      expect(val).toEqual('tao.zeng.zt@gmail.com');
      expect(obj.email).toEqual(val);
      expect(oldVal).toEqual('mary@domain.com');
      observe.un('email');
      done2();
    });
    obj.name = 'Tao.Zeng';
    obj.email = 'tao.zeng.zt@gmail.com';
  }, 100);
  it("Observe changes on multi object property", function(done) {
    let obj = {
        name: 'Mary',
        email: 'mary@domain.com'
      },
      observe = new Observer(obj),
      async = new AsyncDone(done, () => {
        expect(observe.hasListen()).toEqual(false);
      }),
      done1 = async.async(),
      done2 = async.async();

    obj = observe.on(['name', 'email'], (attr, val, oldVal, target) => {
      if (attr === 'name') {
        expect(val).toEqual('Tao.Zeng');
        expect(obj.name).toEqual(val);
        expect(oldVal).toEqual('Mary');
        observe.un('name');
        done1();
      } else {
        expect(attr).toEqual('email');
        expect(val).toEqual('tao.zeng.zt@gmail.com');
        expect(obj.email).toEqual(val);
        expect(oldVal).toEqual('mary@domain.com');
        observe.un('email');
        done2();
      }
    });

    obj.name = 'Tao.Zeng';
    obj.email = 'tao.zeng.zt@gmail.com';
  }, 200);

  it("Observe changes on multi2 object property", function(done) {
    let obj = {
        name: 'Mary',
        email: 'mary@domain.com'
      },
      observe = new Observer(obj),
      async = new AsyncDone(done, () => {
        expect(observe.hasListen()).toEqual(false);
      }),
      done1 = async.async(),
      done2 = async.async();

    obj = observe.on({
      '': (attr, val, oldVal, target) => {
        if (attr === 'name') {
          expect(val).toEqual('Tao.Zeng');
          expect(obj.name).toEqual(val);
          expect(oldVal).toEqual('Mary');
          observe.un('name');
          done1();
        } else {
          expect(attr).toEqual('email');
          expect(val).toEqual('tao.zeng.zt@gmail.com');
          expect(obj.email).toEqual(val);
          expect(oldVal).toEqual('mary@domain.com');
          observe.un('email');
          done2();
        }
      }
    });

    obj.name = 'Tao.Zeng';
    obj.email = 'tao.zeng.zt@gmail.com';
  }, 200);

  it("Observe changes on all object property", function(done) {
    let obj = {
        name: 'Mary',
        email: 'mary@domain.com'
      },
      observe = new Observer(obj),
      async = new AsyncDone(done, () => {
        expect(observe.hasListen()).toEqual(false);
      }),
      done1 = async.async(),
      done2 = async.async();

    obj = observe.on((attr, val, oldVal, target) => {
      if (attr === 'name') {
        expect(val).toEqual('Tao.Zeng');
        expect(obj.name).toEqual(val);
        expect(oldVal).toEqual('Mary');
        observe.un('name');
        done1();
      } else {
        expect(attr).toEqual('email');
        expect(val).toEqual('tao.zeng.zt@gmail.com');
        expect(obj.email).toEqual(val);
        expect(oldVal).toEqual('mary@domain.com');
        observe.un('email');
        done2();
      }
    });

    obj.name = 'Tao.Zeng';
    obj.email = 'tao.zeng.zt@gmail.com';
  }, 200);
});
