const proxy = require('./proxy'),
  vbproxy = require('./vbproxy'),
  timeoutframe = require('./timeoutframe'),
  _ = require('./util')

const config = {
    lazy: true,
    animationFrame: true,
    observerKey: '__OBSERVER__',
    expressionKey: '__EXPR_OBSERVER__'
  }

function abstractFunc() {

}

const Observer = _.dynamicClass({

  constructor(target) {
    this.isArray = _.isArray(target)
    if (!this.isArray && !_.isObject(target)) {
      throw TypeError('can not observe object[' + (Object.prototype.toString.call(target)) + ']')
    }
    this.target = target
    this.obj = target
    this.listens = {}
    this.changeRecords = {}
    this._notify = this._notify.bind(this)
    this.watchPropNum = 0
    this._init()
  },

  _fire(attr, val, oldVal) {
    let handlers

    if (proxy.eq(val, oldVal)) return
    if (!(handlers = this.listens[attr])) return

    _.each(handlers.slice(), (handler) => {
      handler(attr, val, oldVal, this.target)
    })
  },

  _notify() {
    let obj = this.obj

    _.each(this.changeRecords, (val, attr) => {
      this._fire(attr, obj[attr], val)
    })
    this.request_frame = undefined
    this.changeRecords = {}
  },

  _addChangeRecord(attr, oldVal) {
    if (!config.lazy) {
      this._fire(attr, this.obj[attr], oldVal)
    } else if (!(attr in this.changeRecords)) {
      this.changeRecords[attr] = oldVal
      if (!this.request_frame) {
        this.request_frame = (config.animationFrame ?
          window.requestAnimationFrame(this._notify) :
          timeoutframe.requestTimeoutFrame(this._notify))
      }
    }
  },

  checkHandler(handler) {
    if (!_.isFunc(handler))
      throw TypeError('Invalid Observe Handler')
  },

  hasListen(attr, handler) {
    switch (arguments.length) {
      case 0:
        return !!this.watchPropNum
      case 1:
        if (_.isFunc(attr)) {
          return !_.each(this.listens, (handlers) => {
            return _.lastIndexOf(handlers, attr) !== -1
          })
        }
        return !!listens[attr]
      default:
        this.checkHandler(handler)
        return _.lastIndexOf(listens[attr], handler) !== -1
    }
  },

  on(attr, handler) {
    let handlers

    this.checkHandler(handler)
    if (!(handlers = this.listens[attr])) {
      this.listens[attr] = [handler]
      this.watchPropNum++;
      this._watch(attr)
    } else {
      handlers.push(handler)
    }
    return this.target
  },

  _cleanListen(attr) {
    this.listens[attr] = undefined
    this.watchPropNum--;
    this._unwatch(attr)
  },

  un(attr, handler) {
    let handlers = this.listens[attr]

    if (handlers) {
      if (arguments.length == 1) {
        this._cleanListen(attr)
      } else {
        this.checkHandler(handler)

        let i = handlers.length
        while (i--) {
          if (handlers[i] === handler) {
            handlers.splice(i, 1)
            if (!handlers.length) this._cleanListen(attr)
            break
          }
        }
      }
    }
    return this.target
  },

  destroy() {
    if (this.request_frame) {
      config.animationFrame ? window.cancelAnimationFrame(this.request_frame) : timeoutframe.cancelTimeoutFrame(this.request_frame)
      this.request_frame = undefined
    }
    let obj = this.obj
    this._destroy()
    this.obj = undefined
    this.target = undefined
    this.listens = undefined
    this.changeRecords = undefined
    return obj
  },
  _init: abstractFunc,
  _destroy: abstractFunc,
  _watch: abstractFunc,
  _unwatch: abstractFunc
})

function hasListen(obj, attr, handler) {
  let observer = obj[config.observerKey]

  return observer ? observer.hasListen.apply(observer, Array.prototype.slice.call(arguments, 1)) : false
}

function on(obj, attr, handler) {
  let observer = obj[config.observerKey]

  if (!observer) {
    obj = proxy.obj(obj)
    observer = new Observer(obj)
    obj[config.observerKey] = observer
  }
  return observer.on(attr, handler)
}

function un(obj, attr, handler) {
  let observer = obj[config.observerKey]

  if (observer) {
    obj = observer.un.apply(observer, Array.prototype.slice.call(arguments, 1))
    if (!observer.hasListen()) {
      obj[config.observerKey] = undefined
      return observer.destroy()
    }
  }
  return obj
}

const Expression = _.dynamicClass({

  constructor(target, expr, path) {
    this.expr = expr
    this.handlers = []
    this.observers = []
    this.path = path || _.parseExpr(expr)
    this.observeHandlers = this._initObserveHandlers()
    this.target = this._observe(target, 0)
    this._onTargetProxy = this._onTargetProxy.bind(this)
    proxy.on(target, this._onTargetProxy)
  },

  _onTargetProxy(obj, proxy) {
    this.target = proxy;
  },

  _observe(obj, idx) {
    let prop = this.path[idx]

    if (idx + 1 < this.path.length) {
      if (obj[prop])
        obj[prop] = this._observe(obj[prop], idx + 1)
    }
    return on(obj, prop, this.observeHandlers[idx])
  },

  _unobserve(obj, idx) {
    let prop = this.path[idx]

    obj = un(obj, prop, this.observeHandlers[idx])
    if (idx + 1 < this.path.length)
      obj[prop] = this._unobserve(obj[prop], idx + 1)
    return obj
  },

  _initObserveHandlers() {
    return _.map(this.path, function(prop, i) {
      return this._createObserveHandler(i)
    }, this)
  },

  _createObserveHandler(idx) {
    let path = this.path.slice(0, idx + 1),
      rpath = this.path.slice(idx + 1),
      ridx = this.path.length - idx - 1

    return (prop, val, oldVal) => {
      if (ridx) {
        if (oldVal) {
          this._unobserve(oldVal, idx + 1);
          oldVal = _.get(oldVal, rpath);
        } else {
          oldVal = undefined;
        }
        if (val) {
          this._observe(val, idx + 1);
          val = _.get(val, rpath);
        } else {
          val = undefined;
        }
        if (proxy.eq(val, oldVal))
          return;
      }
      _.each(this.handlers.slice(), function(h) {
        h(this.expr, val, oldVal, this.target)
      }, this)
    }
  },
  checkHandler(handler) {
    if (!_.isFunc(handler))
      throw TypeError('Invalid Observe Handler')
  },
  on(handler) {
    this.checkHandler(handler)
    this.handlers.push(handler);
    return this;
  },

  un(handler) {
    if (!arguments.length) {
      this.handlers = [];
    } else {
      this.checkHandler(handler)

      let handlers = this.handlers,
        i = handlers.length;

      while (i--) {
        if (handlers[i] === handler) {
          handlers.splice(i, 1);
          break;
        }
      }
    }
    return this;
  },

  hasListen(handler) {
    if (arguments.length)
      return _.lastIndexOf(this.handlers, handler) != -1;
    return !!this.handlers.length;
  },

  destory() {
    proxy.un(this.target, this._onTargetProxy);
    let obj = this._unobserve(this.target, 0);
    this.target = undefined;
    this.expr = undefined;
    this.handlers = undefined;
    this.path = undefined;
    this.observers = undefined;
    this.observeHandlers = undefined;
    this.target = undefined;
    return obj;
  }
})


let policies = [],
  policyNames = {}

module.exports = {
  registerPolicy(name, priority, checker, policy) {
    let i = policies.length

    policy = {
      name: name,
      priority: priority,
      policy: policy,
      checker: checker
    }
    //console.debug('register policy[%s]: priority = %f', name, priority, policy)
    while (i--) {
      if (policies[i].priority < priority) {
        policies.splice(i, 0, policy)
        return
      }
    }
    policies.push(policy)
    return this
  },

  config: _.create(config),

  init(cfg) {
    if (config.policy) return
    if (cfg) {
      _.each(cfg, (val, key) => {
        config[key] = val
      })
    }
    if (_.each(policies, (policy) => {
        if (policy.checker(config)) {
          _.each(policy.policy(config), (val, key) => {
            Observer.prototype[key] = val
          })
          config.policy = policy.name
          //console.debug('apply policy[%s]', policy.name, policy)
          return false
        }
      }) !== false) throw Error('not supported')
    return this
  },

  on(obj, expr, handler) {
    let path = _.parseExpr(expr);

    if (path.length > 1) {
      let map = obj[config.expressionKey],
        exp = map ? map[expr] : undefined

      if (!exp) {
        exp = new Expression(obj, expr, path)
        if (!map)
          map = obj[config.expressionKey] = {}
        map[expr] = exp
      }
      exp.on(handler)
      return exp.target
    }
    return on.apply(window, arguments);
  },

  un(obj, expr, handler) {
    let path = _.parseExpr(expr);

    if (path.length > 1) {
      let map = obj[config.expressionKey],
        exp = map ? map[expr] : undefined

      if (exp) {
        exp.un.apply(exp, Array.prototype.slice.call(arguments, 2))

        if (!exp.hasListen()) {
          map[expr] = undefined
          return exp.destory();
        }
        return exp.target;
      }
      return proxy.proxy(obj) || obj
    }
    return un.apply(window, arguments);
  },

  hasListen(obj, expr, handler) {
    let l = arguments.length

    switch (l) {
      case 1:
        return hasListen(obj);
      case 2:
        if (_.isFunc(expr))
          return hasListen(obj, expr)
    }

    let path = _.parseExpr(expr)

    if (path.length > 1) {
      let map = obj[config.expressionKey],
        exp = map ? map[expr] : undefined

      return exp ? (l == 2 ? true : exp.hasListen(handler)) : false
    }
    return hasListen.apply(window, arguments)
  }
}
