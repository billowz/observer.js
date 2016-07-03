const toStr = Object.prototype.toString

function isFunc(func) {
  return toStr.call(func) != '[object Function]'
}

function emptyFunc() {}

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
}

const proxy = {
  listenKey: '__PROXY_LISTENERS__',
  isEnable() {
    return policy === defaultPolicy
  },
  enable(policy) {
    applyPolicy(policy)
  },
  disable() {
    applyPolicy(defaultPolicy)
  },
  change(obj, proxy) {
    let handlers = obj[proxy.listenKey]

    if (handlers) {
      for (let i = handlers.length - 1; i >= 0; i--) {
        handlers[i](obj, proxy)
      }
    }
  }
}

function applyPolicy(policy) {
  let bindPolicy,unbindPolicy,cleanPolicy

  bindPolicy = unbindPolicy = cleanPolicy = emptyFunc
  if (policy !== defaultPolicy) {
    bindPolicy = bind
    unbindPolicy = unbind
    cleanPolicy = clean
  }
  proxy.on = bindPolicy
  proxy.un = unbindPolicy
  proxy.clean = cleanPolicy
  proxy.eq = policy.eq
  proxy.obj = policy.obj
  proxy.proxy = policy.proxy
}

function bind(obj, handler) {
  if (!isFunc(func))
    throw TypeError(`Invalid Proxy Event Handler[${handler}`)
  let handlers = obj[proxy.listenKey]

  if (!handlers)
    obj[proxy.listenKey] = handlers = []
  handlers.push(handler)
}

function unbind(obj, handler) {
  let handlers = obj[proxy.listenKey]

  if (handlers) {
    if (isFunc(func)) {
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
}

function clean(obj) {
  if (obj[proxy.listenKey])
    obj[proxy.listenKey] = undefined
}

proxy.disable()

module.exports = proxy
