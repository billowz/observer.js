const core = require('./core'),
  proxy = require('./proxy'),
  _ = require('utility'),
  configuration = require('./configuration')

configuration.register({
  es6Proxy: true,
  es6SourceKey: '__ES6_PROXY_SOURCE__',
  es6ProxyKey: '__ES6_PROXY__'
})

core.registerPolicy('ES6Proxy', 1, function(config) {
  return window.Proxy && config.es6Proxy !== false
}, function(config) {
  let {
    es6SourceKey,
    es6ProxyKey
  } = config

  proxy.enable({
    obj(obj) {
      return obj ? _.getOwnProp(obj, es6SourceKey) || obj : obj
    },
    eq(o1, o2) {
      return o1 === o2 || (o1 && o2 && proxy.obj(o1) === proxy.obj(o2))
    },
    proxy(obj) {
      return obj ? _.getOwnProp(obj, es6ProxyKey) : undefined
    }
  })

  return {
    _init() {
      this.obj = proxy.obj(this.target)
      this.es6proxy = false
    },
    _destroy() {
      this.es6proxy = false
      this.obj[es6ProxyKey] = undefined
      proxy.change(this.obj, undefined)
    },
    _watch(attr) {
      if (!this.es6proxy) {
        let _proxy = this.isArray ? this._arrayProxy() : this._objectProxy(),
          obj = this.obj

        this.target = _proxy
        obj[es6ProxyKey] = _proxy
        obj[es6SourceKey] = obj
        proxy.change(obj, _proxy)
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
