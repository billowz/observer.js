import observer from '../factory'

describe("Observer factory Test Case", () => {
  it("Observe changes on an object property", function(done) {
    let obj = {
      name: 'Mary',
      email: 'mary@domain.com'
    };

    obj = observer.on(obj, 'name', (attr, val, oldVal, target) => {
      expect(attr).toEqual('name');
      expect(val).toEqual('Tao.Zeng');
      expect(obj.email).toEqual('mary@domain.com');
      expect(oldVal).toEqual('Mary');
      expect(target).toEqual(obj);

      obj = observer.un(obj, name);
      done();
    });
    obj.name = 'Tao.Zeng';
  }, 100);
  it("Observe changes on multi object property", function(done) {
    let obj = {
        name: 'Mary',
        email: 'mary@domain.com'
      },
      i = 0;

    obj = observer.on(obj, ['name', 'email'], (attr, val, oldVal, target) => {
      if (i == 0) {
        expect(attr).toEqual('name');
        expect(val).toEqual('Tao.Zeng');
        expect(oldVal).toEqual('Mary');
        expect(obj.name).toEqual('Tao.Zeng');
        expect(obj.email).toEqual('mary@domain.com');
        expect(target).toEqual(obj);
        i++;
      } else {
        expect(attr).toEqual('email');
        expect(val).toEqual('tao.zeng.zt@gmail.com');
        expect(oldVal).toEqual('mary@domain.com');
        expect(obj.name).toEqual('Tao.Zeng');
        expect(obj.email).toEqual('tao.zeng.zt@gmail.com');
        expect(target).toEqual(obj);

        obj = observer.un(obj);
        done();
      }
    });
    obj.name = 'Tao.Zeng';
    setTimeout(() => {
      obj.email = 'tao.zeng.zt@gmail.com';
    }, 50);
  }, 200);
});
