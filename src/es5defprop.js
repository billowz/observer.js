const core = require('./core'),
  proxyPro = require('./proxy'),
  VBClassFactory = require('./vbproxy'),
  {util} = require('./utility'),
  arrayHockMethods = ['push', 'pop', 'shift', 'unshift', 'sort', 'reverse', 'splice'],
  policy = {
    _init() {
      this.watchers = {}
    },
    _destroy() {
      for (let attr in this.watchers) {
        if (this.watchers[attr])
          this._unwatch(attr)
      }
      this.watchers = undefined
    },
    _hockArrayLength(method) {
      let self = this

      this.obj[method] = function() {
        let len = this.length

        Array.prototype[method].apply(this, arguments)
        if (self.obj.length != len)
          self._addChangeRecord('length', len)
      }
    },
    _watch(attr) {
      if (!this.watchers[attr]) {
        if (this.isArray && attr === 'length') {
          util.each(arrayHockMethods, (method) => {
            this._hockArrayLength(method)
          })
        } else {
          this._defineProperty(attr, this.obj[attr])
        }
        this.watchers[attr] = true
      }
    },
    _unwatch(attr) {
      if (this.watchers[attr]) {
        if (this.isArray && attr === 'length') {
          util.each(arrayHockMethods, (method) => {
            delete this.obj[method]
          })
        } else {
          this._undefineProperty(attr, this.obj[attr])
        }
        this.watchers[attr] = false
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
  proxyPro.disable()
  return util.assignIf({
    _defineProperty(attr, value) {
      Object.defineProperty(this.target, attr, {
        enumerable: true,
        configurable: true,
        get: () => {
          return value
        },
        set: (val) => {
          let oldVal = value

          value = val
          this._addChangeRecord(attr, oldVal)
        }
      })
    },
    _undefineProperty(attr, value) {
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
  proxyPro.disable()
  return util.assignIf({
    _defineProperty(attr, value) {
      this.target.__defineGetter__(attr, () => {
        return value
      })
      this.target.__defineSetter__(attr, (val) => {
        let oldVal = value

        value = val
        this._addChangeRecord(attr, oldVal)
      })
    },
    _undefineProperty(attr, value) {
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
  let init = policy._init,
    factory = core.vbfactory = new VBClassFactory([proxyPro.listenKey, config.observerKey, config.expressionKey], proxyPro.change)

  proxyPro.enable({
    obj(obj) {
      return factory.obj(obj)
    },
    eq(o1, o2) {
      return factory.eq(o1, o2)
    },
    proxy(obj) {
      return factory.proxy(obj)
    }
  })

  return util.assignIf({
    _init() {
      init.call(this)
      this.obj = factory.obj(this.target)
    },
    _defineProperty(attr, value) {
      let obj = this.obj,
        desc = factory.descriptor(obj)

      if (!desc)
        desc = factory.descriptor(factory.create(obj))

      this.target = desc.defineProperty(attr, {
        set: (val) => {
          let oldVal = this.obj[attr]
          this.obj[attr] = val
          this._addChangeRecord(attr, oldVal)
        }
      })
    },
    _undefineProperty(attr, value) {
      let obj = this.obj,
        desc = factory.descriptor(obj)

      if (desc) {
        this.target = desc.defineProperty(attr, {
          value: value
        })
        if (!desc.hasAccessor()) {
          this.target = factory.destroy(obj)
        }
      }
    }
  }, policy)
})
