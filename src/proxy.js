const toStr = Object.prototype.toString,
  {util} = require('./utility'),
  {hasOwnProp} = util,
  configuration = require('./configuration'),
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
      let handlers = util.getOwnProp(obj, configuration.get(LISTEN_CONFIG))

      if (handlers) {
        let i = handlers.length
        while (i--) {
          handlers[i](obj, p)
        }
      }
    },
    on(obj, handler) {
      if (!util.isFunc(handler))
        throw TypeError(`Invalid Proxy Event Handler[${handler}`)
      let key = configuration.get(LISTEN_CONFIG),
        handlers = util.getOwnProp(obj, key)

      if (!handlers)
        obj[key] = handlers = []
      handlers.push(handler)
    },
    un(obj, handler) {
      let handlers = util.getOwnProp(obj, configuration.get(LISTEN_CONFIG))

      if (handlers) {
        if (util.isFunc(handler)) {
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

function proxy(o) {
  return proxy.proxy(o)
}

util.assign(proxy, {
  isEnable() {
    return policy === defaultPolicy
  },
  enable(policy) {
    applyPolicy(policy)
  },
  disable() {
    applyPolicy(defaultPolicy)
  }
})


function applyPolicy(policy) {
  let _apply = policy !== defaultPolicy ? function(fn, name) {
    proxy[name] = fn
  } : function(fn, name) {
    proxy[name] = util.emptyFunc
  }
  util.each(apply, _apply)
  util.each(policy, (fn, name) => {
    proxy[name] = fn
  })
}


proxy.disable()

util.get = function(obj, expr, defVal, lastOwn, own) {
  let i = 0,
    path = util.parseExpr(expr, true),
    l = path.length - 1,
    prop

  while (!util.isNil(obj) && i < l) {
    prop = path[i++]
    obj = proxy.obj(obj)
    if (own && !hasOwnProp(obj, prop))
      return defVal
    obj = obj[prop]
  }
  obj = proxy.obj(obj)
  prop = path[i]
  return (i == l && !util.isNil(obj) && (own ? hasOwnProp(obj, prop) : prop in obj)) ? obj[prop] : defVal
}

util.hasOwnProp = function(obj, prop) {
  return hasOwnProp(proxy.obj(obj), prop)
}
module.exports = proxy
