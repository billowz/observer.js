import observer from '../factory'
import proxy from '../proxyEvent'

describe("Observer factory", () => {
  it("Observe changes", function(done) {
    let obj = {
      name: 'Mary',
      email: 'mary@domain.com'
    };

    obj = observer.on(obj, 'name', (attr, val, oldVal, target) => {
      expect(attr).equal('name');
      expect(val).equal('Tao.Zeng');
      expect(oldVal).equal('Mary');
      expect(obj.name).equal(val);
      expect(target).equal(obj);

      expect(observer._get(proxy.obj(obj))).not.equal(undefined);
      obj = observer.un(obj, 'name');
      expect(observer._get(proxy.obj(obj))).equal(undefined);
      done();
    });
    obj.name = 'Tao.Zeng';
  }, 100);
});
