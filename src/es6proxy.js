const core = require('./core'),
  proxy = require('./proxy'),
  {util} = require('./utility')

core.registerPolicy('ES6Proxy', 1, function(config) {
  return window.Proxy && config.es6Proxy !== false
}, function(config) {
  config.es6SourceKey = config.es6SourceKey || '__ES6_PROXY_SOURCE__'
  config.es6ProxyKey = config.es6ProxyKey || '__ES6_PROXY__'

  proxy.enable({
    obj(obj) {
      return obj[config.es6SourceKey] || obj
    },
    eq(o1, o2) {
      return proxy.obj(o1) === proxy.obj(o2)
    },
    proxy(obj) {
      return obj[config.es6ProxyKey]
    }
  })

  return {
    _init() {
      this.obj = proxy.obj(this.target)
      this.es6proxy = false
    },
    _destroy() {
      this.es6proxy = false
      this.obj[config.es6ProxyKey] = undefined
      this.obj[config.es6SourceKey] = undefined
      proxy.change(this.obj, undefined)
    },
    _watch(attr) {
      if (!this.es6proxy) {
        let proxy = this.isArray ? this._arrayProxy() : this._objectProxy(),
          obj = this.obj

        this.target = proxy
        obj[config.es6ProxyKey] = proxy
        obj[config.es6ProxyKey] = obj
        proxy.change(obj, proxy)
        this.es6proxy = true
      }
    },
    _unwatch(attr) {},
    _arrayProxy() {
      let oldLength = this.target.length

      return new Proxy(this.obj, {
        set: (obj, prop, value) => {
          if (this.listens[prop]) {
            let oldVal

            if (prop === 'length') {
              oldVal = oldLength
              oldLength = value
            } else {
              oldVal = obj[prop]
            }
            obj[prop] = value
            if (value !== oldVal)
              this._addChangeRecord(prop, oldVal)
          } else {
            obj[prop] = value
          }
          return true
        }
      })
    },
    _objectProxy() {
      return new Proxy(this.obj, {
        set: (obj, prop, value) => {
          if (this.listens[prop]) {
            let oldVal = obj[prop]

            obj[prop] = value
            if (value !== oldVal)
              this._addChangeRecord(prop, oldVal)
          } else {
            obj[prop] = value
          }
          return true
        }
      })
    }
  }
})
