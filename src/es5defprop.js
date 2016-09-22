import _ from 'utility'
import core from './core'
import proxy from './proxy'
import VBClassFactory from './vbproxy'
import configuration from './configuration'

configuration.register({
  defaultProps: []
})

const policy = {
  init() {
    this.watchers = {}
  },
  watch(attr) {
    let watchers = this.watchers
    if (!watchers[attr]) {
      this.defineProperty(attr, this.obj[attr])
      watchers[attr] = true
    }
  },
  unwatch(attr) {
    let watchers = this.watchers
    if (watchers[attr]) {
      this.undefineProperty(attr, this.obj[attr])
      watchers[attr] = false
    }
  }
}

core.registerPolicy('ES5DefineProperty', 10, function(config) {
  if (Object.defineProperty) {
    try {
      let val, obj = {}
      Object.defineProperty(obj, 'sentinel', {
        get() {
          return val
        },
        set(value) {
          val = value
        }
      })
      obj.sentinel = 1
      return obj.sentinel === val
    } catch (e) {}
  }
  return false
}, function(config) {
  return _.assignIf({
    defineProperty(attr, value) {
      Object.defineProperty(this.target, attr, {
        enumerable: true,
        configurable: true,
        get: () => {
          return value
        },
        set: (val) => {
          let oldVal = value
          value = val
          this.addChangeRecord(attr, oldVal)
        }
      })
    },
    undefineProperty(attr, value) {
      Object.defineProperty(this.target, attr, {
        enumerable: true,
        configurable: true,
        writable: true,
        value: value
      })
    }
  }, policy)
})


core.registerPolicy('DefineGetterAndSetter', 20, function(config) {
  return '__defineGetter__' in {}
}, function(config) {
  return _.assignIf({
    defineProperty(attr, value) {
      this.target.__defineGetter__(attr, () => {
        return value
      })
      this.target.__defineSetter__(attr, (val) => {
        let oldVal = value

        value = val
        this.addChangeRecord(attr, oldVal)
      })
    },
    undefineProperty(attr, value) {
      this.target.__defineGetter__(attr, () => {
        return value
      })
      this.target.__defineSetter__(attr, (val) => {
        value = val
      })
    }
  }, policy)
})

core.registerPolicy('VBScriptProxy', 30, function(config) {
  return VBClassFactory.isSupport()
}, function(config) {

  let factory

  proxy.enable({
    obj(obj) {
      return obj && factory.obj(obj)
    },
    eq(o1, o2) {
      return o1 === o2 || proxy.obj(o1) === proxy.obj(o2)
    },
    proxy(obj) {
      return obj && (factory.proxy(obj) || obj)
    }
  })
  factory = core.vbfactory = new VBClassFactory([
    config.proxyListenKey, config.observerKey, config.expressionKey, _.LinkedList.ListKey
  ].concat(config.defaultProps || []), proxy.change)

  return _.assignIf({
    defineProperty(attr, value) {
      let obj = this.obj

      this.target = (factory.descriptor(obj) || factory.create(obj)).defineProperty(attr, {
        set: (val) => {
          let oldVal = obj[attr]
          obj[attr] = val
          this.addChangeRecord(attr, oldVal)
        }
      })
    },
    undefineProperty(attr, value) {
      let obj = this.obj,
        desc = factory.descriptor(obj)

      if (desc)
        desc.defineProperty(attr, {
          value: value
        })
    }
  }, policy)
})
