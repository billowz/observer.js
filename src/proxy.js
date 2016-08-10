import _ from 'utility'
import configuration from './configuration'

const toStr = Object.prototype.toString,
  hasOwn = Object.prototype.hasOwnProperty,
  LISTEN_CONFIG = 'proxyListenKey'

configuration.register(LISTEN_CONFIG, '__PROXY_LISTENERS__')

const defaultPolicy = {
    eq(o1, o2) {
      return o1 === o2
    },
    obj(o) {
      return o
    },
    proxy(o) {
      return o
    }
  },
  apply = {
    change(obj, p) {
      let handlers = _.getOwnProp(obj, configuration.get(LISTEN_CONFIG))

      if (handlers) {
        let i = handlers.length
        while (i--) {
          handlers[i](obj, p)
        }
      }
    },
    on(obj, handler) {
      if (!_.isFunc(handler))
        throw TypeError(`Invalid Proxy Event Handler[${handler}`)
      let key = configuration.get(LISTEN_CONFIG),
        handlers = _.getOwnProp(obj, key)

      if (!handlers)
        obj[key] = handlers = []
      handlers.push(handler)
    },
    un(obj, handler) {
      let handlers = _.getOwnProp(obj, configuration.get(LISTEN_CONFIG))

      if (handlers) {
        if (_.isFunc(handler)) {
          let i = handlers.length

          while (i-- > 0) {
            if (handlers[i] === handler) {
              handlers.splice(i, 1)
              return true
            }
          }
        }
      }
      return false
    },
    clean(obj) {
      if (obj[proxy.listenKey])
        obj[proxy.listenKey] = undefined
    }
  }

export default function proxy(o) {
  return proxy.proxy(o)
}

let hasEnabled = false
_.assign(proxy, {
  isEnable() {
    return proxy.on !== _.emptyFunc
  },
  enable(policy) {
    applyPolicy(policy)
    if (!hasEnabled) {
      _.overrideHasOwnProlicy(function(prop) {
        return hasOwn.call(proxy.obj(this), prop)
      })
      _.get = function(obj, expr, defVal, lastOwn, own) {
        let i = 0,
          path = _.parseExpr(expr, true),
          l = path.length - 1,
          prop

        while (!_.isNil(obj) && i < l) {
          prop = path[i++]
          obj = proxy.obj(obj)
          if (own && !hasOwn.call(obj, prop))
            return defVal
          obj = obj[prop]
        }
        obj = proxy.obj(obj)
        prop = path[i]
        return (i == l && !_.isNil(obj) && (own ? hasOwn.call(obj, prop) : prop in obj)) ? obj[prop] : defVal
      }
      hasEnabled = true
    }
  },
  disable() {
    applyPolicy(defaultPolicy)
  }
})


function applyPolicy(policy) {
  let _apply = policy !== defaultPolicy ? function(fn, name) {
    proxy[name] = fn
  } : function(fn, name) {
    proxy[name] = _.emptyFunc
  }
  _.each(apply, _apply)
  _.each(policy, (fn, name) => {
    proxy[name] = fn
  })
}

proxy.disable()
