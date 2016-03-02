import observer from '../factory'

describe("Observer factory", () => {
  it("Observe changes", function(done) {
    let obj = {
      name: 'Mary',
      email: 'mary@domain.com'
    };

    obj = observer.on(obj, 'name', (attr, val, oldVal, target) => {
      expect(attr).toEqual('name');
      expect(val).toEqual('Tao.Zeng');
      expect(oldVal).toEqual('Mary');
      expect(obj.name).toEqual(val);
      expect(target).toEqual(obj);

      expect(observer._get(observer.obj(obj))).not.toBeUndefined();
      obj = observer.un(obj, 'name');
      expect(observer._get(observer.obj(obj))).toBeUndefined();
      done();
    });
    obj.name = 'Tao.Zeng';
  }, 100);
});
