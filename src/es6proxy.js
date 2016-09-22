import _ from 'utility'
import core from './core'
import proxy from './proxy'
import configuration from './configuration'

configuration.register({
  es6Proxy: true,
  es6SourceKey: '__ES6_PROXY_SOURCE__',
  es6ProxyKey: '__ES6_PROXY__'
})

const hasOwn = Object.prototype.hasOwnProperty

core.registerPolicy('ES6Proxy', 1, function(config) {
  return window.Proxy && config.es6Proxy !== false
}, function(config) {
  let {
    es6SourceKey,
    es6ProxyKey
  } = config

  proxy.enable({
    obj(obj) {
      if (obj && hasOwn.call(obj, es6SourceKey))
        return obj[es6SourceKey]
      return obj
    },
    eq(o1, o2) {
      return o1 === o2 || proxy.obj(o1) === proxy.obj(o2)
    },
    proxy(obj) {
      if (obj && hasOwn.call(obj, es6ProxyKey))
        return obj[es6ProxyKey] || obj
      return obj
    }
  })

  return {
    init() {
      this.es6proxy = false
    },
    watch(attr) {
      if (!this.es6proxy) {
        let _proxy = this.objectProxy(),
          obj = this.obj

        this.target = _proxy
        obj[es6ProxyKey] = _proxy
        obj[es6SourceKey] = obj
        proxy.change(obj, _proxy)
        this.es6proxy = true
      }
    },
    unwatch(attr) {},
    objectProxy() {
      return new Proxy(this.obj, {
        set: (obj, prop, value) => {
          if (this.listens[prop]) {
            let oldVal = obj[prop]
            obj[prop] = value
            this.addChangeRecord(prop, oldVal)
          } else {
            obj[prop] = value
          }
          return true
        }
      })
    }
  }
})
