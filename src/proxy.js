import _ from 'utility'
import configuration from './configuration'

const toStr = Object.prototype.toString,
  hasOwn = Object.prototype.hasOwnProperty,
  LISTEN_CONFIG = 'proxyListenKey',
  {
    LinkedList
  } = _

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

      if (handlers)
        handlers.each(handler => handler(obj, p))
    },
    on(obj, handler) {
      if (!_.isFunc(handler))
        throw TypeError(`Invalid Proxy Event Handler[${handler}`)
      let key = configuration.get(LISTEN_CONFIG),
        handlers = _.getOwnProp(obj, key)

      if (!handlers)
        obj[key] = handlers = new LinkedList()
      handlers.push(handler)
    },
    un(obj, handler) {
      let handlers = _.getOwnProp(obj, configuration.get(LISTEN_CONFIG))

      if (handlers && _.isFunc(handler))
        handlers.remove(handler)
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
      _.overridePolicy('hasOwn', function(obj, prop) {
        return hasOwn.call(proxy.obj(obj), prop)
      })

      _.overridePolicy('eq', proxy.eq)
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
