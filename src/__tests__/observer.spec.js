import observer from '../index'

describe("Observer", () => {
  it("Observe changes", function(done) {
    var obj = {
        obj: {
          arr: [{
            a: 123
          }]
        }
      },
      path = 'obj.arr[0].a'

    obj = observer.on(obj, path, function() {
      /*
      expect(Array.prototype.slice.call(arguments)).eql([path, 'abc', 123, obj])
      expect(observer.hasListen(obj, path)).equal(true)
      observer.un(obj, path)
      expect(observer.hasListen(obj)).equal(false)
      done()*/
    })
    expect(observer.hasListen(obj, path)).equal(true)
    obj.obj.arr[0].a = 'abc'
  })

})
