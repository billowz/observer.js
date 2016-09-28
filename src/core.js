import _ from 'utility'
import proxy from './proxy'
import configuration from './configuration'
import logger from './log'

const timeoutframe = _.timeoutframe,
  config = configuration.get(),
  {
    LinkedList
  } = _

configuration.register({
  lazy: true,
  animationFrame: true,
  observerKey: '__OBSERVER__',
  expressionKey: '__EXPR_OBSERVER__'
})

const Observer = _.dynamicClass({
  constructor(target) {
    this.obj = target
    this.target = target
    this.listens = {}
    this.changeRecords = {}
    this.notify = this.notify.bind(this)
    this.watchPropNum = 0
    this.init()
  },

  fire(attr, val, oldVal) {
    let handlers = this.listens[attr]

    if (handlers) {
      var primitive = _.isPrimitive(val),
        eq = proxy.eq(val, oldVal)
      if (!primitive || !eq)
        handlers.each((handler) => {
          handler(attr, val, oldVal, this.target, eq)
        })
    }
  },

  notify() {
    let obj = this.obj,
      changeRecords = this.changeRecords

    this.request_frame = undefined
    this.changeRecords = {}

    _.each(changeRecords, (val, attr) => {
      this.fire(attr, obj[attr], val)
    })
  },

  addChangeRecord(attr, oldVal) {
    if (!config.lazy) {
      this.fire(attr, this.obj[attr], oldVal)
    } else if (!(attr in this.changeRecords) && this.listens[attr]) {
      this.changeRecords[attr] = oldVal
      if (!this.request_frame)
        this.request_frame = (config.animationFrame ?
          window.requestAnimationFrame(this.notify) :
          timeoutframe.request(this.notify))
    }
  },

  hasListen(attr, handler) {
    switch (arguments.length) {
      case 0:
        return !!this.watchPropNum
      case 1:
        if (_.isFunc(attr)) {
          return !_.each(this.listens, (handlers) => {
            return handlers.contains(attr)
          })
        }
        return !!this.listens[attr]
      default:
        let handlers = this.listens[attr]
        return !!handlers && handlers.contains(handler)
    }
  },

  on(attr, handler) {
    let handlers

    if (!(handlers = this.listens[attr]))
      this.listens[attr] = handlers = new LinkedList()

    if (handlers.empty()) {
      this.watchPropNum++;
      this.watch(attr)
    }

    handlers.push(handler)
    return this.target
  },

  un(attr, handler) {
    let handlers = this.listens[attr]

    if (handlers && !handlers.empty()) {
      if (arguments.length == 1) {
        handlers.clean()
        this.watchPropNum--;
        this.unwatch(attr)
      } else {
        handlers.remove(handler)
        if (handlers.empty()) {
          this.watchPropNum--;
          this.unwatch(attr)
        }
      }
    }
    return this.watchPropNum ? this.target : this.obj
  },
  init: _.emptyFunc,
  watch: _.emptyFunc,
  unwatch: _.emptyFunc
})

function hasListen(obj, attr, handler) {
  let observer = _.getOwnProp(obj, config.observerKey)

  return observer ? arguments.length == 1 ? observer.hasListen() :
    arguments.length == 2 ? observer.hasListen(attr) : observer.hasListen(attr, handler) : false
}

function on(obj, attr, handler) {
  let observer = _.getOwnProp(obj, config.observerKey)

  if (!observer) {
    observer = new Observer(obj)
    obj[config.observerKey] = observer
  }
  return observer.on(attr, handler)
}

function un(obj, attr, handler) {
  let observer = _.getOwnProp(obj, config.observerKey)

  if (observer)
    return arguments.length == 2 ? observer.un(attr) : observer.un(attr, handler)
  return obj
}

let expressionIdGenerator = 0

const Expression = _.dynamicClass({

  constructor(target, expr, path) {
    this.id = expressionIdGenerator++;
    this.expr = expr
    this.handlers = new LinkedList()
    this.observers = []
    this.path = path || _.parseExpr(expr)
    this.observeHandlers = this._initObserveHandlers()
    this.obj = target
    this.target = this._observe(target, 0)
    if (proxy.isEnable()) {
      this._onTargetProxy = this._onTargetProxy.bind(this)
      proxy.on(target, this._onTargetProxy)
    }
  },

  _onTargetProxy(obj, proxy) {
    this.target = proxy
  },

  _observe(obj, idx) {
    let prop = this.path[idx],
      o

    if (idx + 1 < this.path.length && (o = obj[prop])) {
      o = this._observe(proxy.obj(o), idx + 1)
      if (proxy.isEnable()) obj[prop] = o
    }
    return on(obj, prop, this.observeHandlers[idx])
  },

  _unobserve(obj, idx) {
    let prop = this.path[idx],
      o,
      ret

    ret = un(obj, prop, this.observeHandlers[idx])
    if (idx + 1 < this.path.length && (o = obj[prop])) {
      o = this._unobserve(proxy.obj(o), idx + 1)
      if (proxy.isEnable()) obj[prop] = o
    }
    return ret
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

    return (prop, val, oldVal, t, eq) => {
      if (ridx) {
        if (eq) return

        if (oldVal) {
          oldVal = proxy.obj(oldVal)
          this._unobserve(oldVal, idx + 1)
          oldVal = _.get(oldVal, rpath)
        } else {
          oldVal = undefined
        }

        if (val) {
          let mobj = proxy.obj(val)

          val = _.get(mobj, rpath)
          mobj = this._observe(mobj, idx + 1)
          if (proxy.isEnable()) {
            // update proxy val
            let i = 0,
              obj = this.obj

            while (i < idx) {
              obj = proxy.obj(obj[path[i++]])
              if (!obj) return
            }
            obj[path[i]] = mobj
          }
        } else {
          val = undefined
        }

        let primitive = _.isPrimitive(val)
        eq = proxy.eq(val, oldVal)

        if (primitive && eq)
          return
      }
      this.handlers.each(handler => handler(this.expr, val, oldVal, this.target, eq))
    }
  },
  on(handler) {
    this.handlers.push(handler)
    return this
  },

  un(handler) {
    if (!arguments.length) {
      this.handlers.clean()
    } else {
      this.handlers.remove(handler)
    }
    return this
  },

  hasListen(handler) {
    return arguments.length ? this.handlers.contains(handler) : !this.handlers.empty()
  }
})

let policies = [],
  policyNames = {}

let inited = false

export default {
  on(obj, expr, handler) {
      let path = _.parseExpr(expr)

      obj = proxy.obj(obj)
      if (path.length > 1) {
        let map = _.getOwnProp(obj, config.expressionKey),
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
      return on(obj, expr, handler)
    },
    un(obj, expr, handler) {
      let path = _.parseExpr(expr)

      obj = proxy.obj(obj)
      if (path.length > 1) {
        let map = _.getOwnProp(obj, config.expressionKey),
          exp = map ? map[expr] : undefined

        if (exp) {
          arguments.length == 2 ? exp.un() : exp.un(handler)
          return exp.hasListen() ? exp.target : exp.obj
        }
        return obj
      }
      return arguments.length == 2 ? un(obj, expr) : un(obj, expr, handler)
    },
    hasListen(obj, expr, handler) {
      let l = arguments.length

      obj = proxy.obj(obj)
      switch (l) {
        case 1:
          return hasListen(obj)
        case 2:
          if (_.isFunc(expr))
            return hasListen(obj, expr)
      }

      let path = _.parseExpr(expr)

      if (path.length > 1) {
        let map = _.getOwnProp(obj, config.expressionKey),
          exp = map ? map[expr] : undefined

        return exp ? (l == 2 ? true : exp.hasListen(handler)) : false
      }
      return hasListen.apply(null, arguments)
    },
    registerPolicy(name, priority, checker, policy) {
      policies.push({
        name: name,
        priority: priority,
        policy: policy,
        checker: checker
      })
      policies.sort((p1, p2) => {
        return p1.priority - p2.priority
      })
      logger.info('register observe policy[%s], priority is %d', name, priority)
      return this
    },
    init(cfg) {
      if (!inited) {
        configuration.config(cfg)
        if (_.each(policies, (policy) => {
            if (policy.checker(config)) {
              _.each(policy.policy(config), (val, key) => {
                Observer.prototype[key] = val
              })
              config.policy = policy.name
              logger.info('apply observe policy[%s], priority is %d', policy.name, policy.priority)
              return false
            }
          }) !== false) throw Error('observer is not supported')
        inited = true
      }
      return this
    }
}
