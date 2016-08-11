import observer from '../index'
import _ from 'utility'

observer.init({
  es6Proxy: true
})

function test(name, obj, path, steps, done) {
  const logger = new _.Logger(name, 'debug')
  let step = 0

  function watchVal(step) {
    return 'watch' in step ? step.watch : step.val
  }

  function handler(path2, val, oldVal) {
    let _oldVal = watchVal(steps[step - 1]),
      _val = watchVal(steps[step])

    logger.debug('step[%s]: handler %s(%s) %s(%s) to %s(%s)', step, path, path2, oldVal, _oldVal, val, _val)

    expect(Array.prototype.slice.call(arguments)).eql([path, _val, _oldVal, obj])

    if (!steps[step + 1]) {
      logger.debug('test end')
      observer.un(obj, path, handler)
      expect(observer.hasListen(obj, path, handler)).equal(false)
      done()
    } else {
      setTimeout(update, 0)
    }
  }

  obj = observer.on(obj, path, handler)

  expect(observer.hasListen(obj, path, handler)).equal(true)

  function update() {
    let oldVal = _.get(obj, path),
      desc = steps[++step]
    var o2 = obj
    _.set(obj, desc.path || path, desc.val)

    logger.debug('step[%s]: update path[%s = %s] %s to %s', step, desc.path || path, desc.val, oldVal, _.get(obj, path), desc.val)
  }

  update()
}

describe("Observer", () => {
  it('simple property', (done) => {
    let arr = []
    test('spec-simple-property', {}, 'prop', [{
      val: undefined
    }, {
      val: 'abc'
    }, {
      val: 123
    }, {
      val: arr
    }, {
      val: arr
    }, {
      val: new Date()
    }, {
      val: undefined
    }], done)
  })

  it("path property", function(done) {
    test('spec-path-property', {}, 'obj.array[0].prop', [{
      val: undefined
    }, {
      path: 'obj',
      val: {
        array: [{
          prop: '123'
        }]
      },
      watch: '123'
    }, {
      path: 'obj',
      val: {
        array: [{
          prop: 123
        }]
      },
      watch: 123
    }, {
      path: 'obj.array[0]',
      val: {
        prop: 'abc'
      },
      watch: 'abc'
    }, {
      path: 'obj.array',
      val: [{
        prop: null
      }],
      watch: null
    }, {
      path: 'obj',
      val: null,
      watch: undefined
    }], done)
  })
})
