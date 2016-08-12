/*
 * observer.js v0.2.7 built in Fri, 12 Aug 2016 04:19:58 GMT
 * Copyright (c) 2016 Tao Zeng <tao.zeng.zt@gmail.com>
 * Released under the MIT license
 * support IE6+ and other browsers
 *https://github.com/tao-zeng/observer.js
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('utility')) :
  typeof define === 'function' && define.amd ? define('observer', ['utility'], factory) :
  (global.observer = factory(global.utility));
}(this, function (_) {

_ = 'default' in _ ? _['default'] : _;

var configuration = new _.Configuration();

var hasOwn = Object.prototype.hasOwnProperty;
var LISTEN_CONFIG = 'proxyListenKey';
configuration.register(LISTEN_CONFIG, '__PROXY_LISTENERS__');

var defaultPolicy = {
  eq: function (o1, o2) {
    return o1 === o2;
  },
  obj: function (o) {
    return o;
  },
  proxy: function (o) {
    return o;
  }
};
var apply = {
  change: function (obj, p) {
    var handlers = _.getOwnProp(obj, configuration.get(LISTEN_CONFIG));

    if (handlers) {
      var i = handlers.length;
      while (i--) {
        handlers[i](obj, p);
      }
    }
  },
  on: function (obj, handler) {
    if (!_.isFunc(handler)) throw TypeError('Invalid Proxy Event Handler[' + handler);
    var key = configuration.get(LISTEN_CONFIG),
        handlers = _.getOwnProp(obj, key);

    if (!handlers) obj[key] = handlers = [];
    handlers.push(handler);
  },
  un: function (obj, handler) {
    var handlers = _.getOwnProp(obj, configuration.get(LISTEN_CONFIG));

    if (handlers) {
      if (_.isFunc(handler)) {
        var i = handlers.length;

        while (i-- > 0) {
          if (handlers[i] === handler) {
            handlers.splice(i, 1);
            return true;
          }
        }
      }
    }
    return false;
  },
  clean: function (obj) {
    if (obj[proxy$1.listenKey]) obj[proxy$1.listenKey] = undefined;
  }
};
function proxy$1(o) {
  return proxy$1.proxy(o);
}

var hasEnabled = false;
_.assign(proxy$1, {
  isEnable: function () {
    return proxy$1.on !== _.emptyFunc;
  },
  enable: function (policy) {
    applyPolicy(policy);
    if (!hasEnabled) {
      _.overrideHasOwnProlicy(function (prop) {
        return hasOwn.call(proxy$1.obj(this), prop);
      });
      _.get = function (obj, expr, defVal, lastOwn, own) {
        var i = 0,
            path = _.parseExpr(expr, true),
            l = path.length - 1,
            prop = void 0;

        while (!_.isNil(obj) && i < l) {
          prop = path[i++];
          obj = proxy$1.obj(obj);
          if (own && !hasOwn.call(obj, prop)) return defVal;
          obj = obj[prop];
        }
        obj = proxy$1.obj(obj);
        prop = path[i];
        return i == l && !_.isNil(obj) && (own ? hasOwn.call(obj, prop) : prop in obj) ? obj[prop] : defVal;
      };
      hasEnabled = true;
    }
  },
  disable: function () {
    applyPolicy(defaultPolicy);
  }
});

function applyPolicy(policy) {
  var _apply = policy !== defaultPolicy ? function (fn, name) {
    proxy$1[name] = fn;
  } : function (fn, name) {
    proxy$1[name] = _.emptyFunc;
  };
  _.each(apply, _apply);
  _.each(policy, function (fn, name) {
    proxy$1[name] = fn;
  });
}

proxy$1.disable();

var logger = new _.Logger('observer', 'info');

var timeoutframe = _.timeoutframe;
var config = configuration.get();
configuration.register({
  lazy: true,
  animationFrame: true,
  observerKey: '__OBSERVER__',
  expressionKey: '__EXPR_OBSERVER__'
});

var Observer = _.dynamicClass({
  constructor: function (target) {
    this.target = target;
    this.obj = target;
    this.listens = {};
    this.changeRecords = {};
    this._notify = this._notify.bind(this);
    this.watchPropNum = 0;
    this._init();
  },
  _fire: function (attr, val, oldVal) {
    var _this = this;

    var handlers = this.listens[attr];
    if (handlers && (!proxy$1.eq(val, oldVal) || _.isArray(val))) _.each(handlers.slice(), function (handler) {
      handler(attr, val, oldVal, _this.target);
    });
  },
  _notify: function () {
    var _this2 = this;

    var obj = this.obj,
        changeRecords = this.changeRecords;

    this.request_frame = undefined;
    this.changeRecords = {};

    _.each(changeRecords, function (val, attr) {
      _this2._fire(attr, obj[attr], val);
    });
  },
  _addChangeRecord: function (attr, oldVal) {
    if (!config.lazy) {
      this._fire(attr, this.obj[attr], oldVal);
    } else if (!(attr in this.changeRecords)) {
      this.changeRecords[attr] = oldVal;
      if (!this.request_frame) {
        this.request_frame = config.animationFrame ? window.requestAnimationFrame(this._notify) : timeoutframe.request(this._notify);
      }
    }
  },
  checkHandler: function (handler) {
    if (!_.isFunc(handler)) throw TypeError('Invalid Observe Handler');
  },
  hasListen: function (attr, handler) {
    switch (arguments.length) {
      case 0:
        return !!this.watchPropNum;
      case 1:
        if (_.isFunc(attr)) {
          return !_.each(this.listens, function (handlers) {
            return _.lastIndexOf(handlers, attr) !== -1;
          });
        }
        return !!this.listens[attr];
      default:
        this.checkHandler(handler);
        return _.lastIndexOf(this.listens[attr], handler) !== -1;
    }
  },
  on: function (attr, handler) {
    var handlers = void 0;

    this.checkHandler(handler);
    if (!(handlers = this.listens[attr])) {
      this.listens[attr] = [handler];
      this.watchPropNum++;
      this._watch(attr);
    } else {
      handlers.push(handler);
    }
    return this.target;
  },
  _cleanListen: function (attr) {
    this.listens[attr] = undefined;
    this.watchPropNum--;
    this._unwatch(attr);
  },
  un: function (attr, handler) {
    var handlers = this.listens[attr];

    if (handlers) {
      if (arguments.length == 1) {
        this._cleanListen(attr);
      } else {
        this.checkHandler(handler);

        var i = handlers.length;
        while (i--) {
          if (handlers[i] === handler) {
            handlers.splice(i, 1);
            if (!handlers.length) this._cleanListen(attr);
            break;
          }
        }
      }
    }
    return this.target;
  },
  destroy: function () {
    if (this.request_frame) {
      config.animationFrame ? window.cancelAnimationFrame(this.request_frame) : timeoutframe.cancel(this.request_frame);
      this.request_frame = undefined;
    }
    var obj = this.obj;
    this._destroy();
    this.obj = undefined;
    this.target = undefined;
    this.listens = undefined;
    this.changeRecords = undefined;
    return obj;
  },

  _init: _.emptyFunc,
  _destroy: _.emptyFunc,
  _watch: _.emptyFunc,
  _unwatch: _.emptyFunc
});

function hasListen(obj, attr, handler) {
  var observer = _.getOwnProp(obj, config.observerKey);

  return observer ? arguments.length == 1 ? observer.hasListen() : arguments.length == 2 ? observer.hasListen(attr) : observer.hasListen(attr, handler) : false;
}

function on(obj, attr, handler) {
  var observer = _.getOwnProp(obj, config.observerKey);

  if (!observer) {
    obj = proxy$1.obj(obj);
    observer = new Observer(obj);
    obj[config.observerKey] = observer;
  }
  return observer.on(attr, handler);
}

function un(obj, attr, handler) {
  var observer = _.getOwnProp(obj, config.observerKey);

  if (observer) {
    obj = arguments.length == 2 ? observer.un(attr) : observer.un(attr, handler);
    if (!observer.hasListen()) {
      obj[config.observerKey] = undefined;
      return observer.destroy();
    }
  }
  return obj;
}

var expressionIdGenerator = 0;

var Expression = _.dynamicClass({
  constructor: function (target, expr, path) {
    this.id = expressionIdGenerator++;
    this.expr = expr;
    this.handlers = [];
    this.observers = [];
    this.path = path || _.parseExpr(expr);
    this.observeHandlers = this._initObserveHandlers();
    this.obj = proxy$1.obj(target);
    this.target = this._observe(this.obj, 0);
    if (proxy$1.isEnable()) {
      this._onTargetProxy = this._onTargetProxy.bind(this);
      proxy$1.on(target, this._onTargetProxy);
    }
  },
  _onTargetProxy: function (obj, proxy) {
    this.target = proxy;
  },
  _observe: function (obj, idx) {
    var prop = this.path[idx],
        o = void 0;

    if (idx + 1 < this.path.length && (o = obj[prop])) {
      o = this._observe(proxy$1.obj(o), idx + 1);
      if (proxy$1.isEnable()) obj[prop] = o;
    }
    return on(obj, prop, this.observeHandlers[idx]);
  },
  _unobserve: function (obj, idx) {
    var prop = this.path[idx],
        o = void 0,
        ret = void 0;

    ret = un(obj, prop, this.observeHandlers[idx]);
    if (idx + 1 < this.path.length && (o = obj[prop])) {
      o = this._unobserve(proxy$1.obj(o), idx + 1);
      if (proxy$1.isEnable()) obj[prop] = o;
    }
    return ret;
  },
  _initObserveHandlers: function () {
    return _.map(this.path, function (prop, i) {
      return this._createObserveHandler(i);
    }, this);
  },
  _createObserveHandler: function (idx) {
    var _this3 = this;

    var path = this.path.slice(0, idx + 1),
        rpath = this.path.slice(idx + 1),
        ridx = this.path.length - idx - 1;

    return function (prop, val, oldVal) {
      if (ridx) {
        if (val) {
          var mobj = proxy$1.obj(val),
              obj = _this3.obj;

          val = _.get(mobj, rpath);
          mobj = _this3._observe(mobj, idx + 1);
          if (proxy$1.isEnable()) {
            // update proxy val
            var i = 0;
            while (i < idx) {
              obj = proxy$1.obj(obj[path[i++]]);
              if (!obj) return;
            }
            obj[path[i]] = mobj;
          }
        } else {
          val = undefined;
        }

        if (oldVal) {
          oldVal = proxy$1.obj(oldVal);
          _this3._unobserve(oldVal, idx + 1);
          oldVal = _.get(oldVal, rpath);
        } else {
          oldVal = undefined;
        }

        if (proxy$1.eq(val, oldVal)) return;
      }
      _.each(_this3.handlers.slice(), function (h) {
        h(this.expr, val, oldVal, this.target);
      }, _this3);
    };
  },
  checkHandler: function (handler) {
    if (!_.isFunc(handler)) throw TypeError('Invalid Observe Handler');
  },
  on: function (handler) {
    this.checkHandler(handler);
    this.handlers.push(handler);
    return this;
  },
  un: function (handler) {
    if (!arguments.length) {
      this.handlers = [];
    } else {
      this.checkHandler(handler);

      var handlers = this.handlers,
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
  hasListen: function (handler) {
    return arguments.length ? _.lastIndexOf(this.handlers, handler) != -1 : !!this.handlers.length;
  },
  destory: function () {
    proxy$1.un(this.target, this._onTargetProxy);
    var obj = this._unobserve(this.obj, 0);
    this.obj = undefined;
    this.target = undefined;
    this.expr = undefined;
    this.handlers = undefined;
    this.path = undefined;
    this.observers = undefined;
    this.observeHandlers = undefined;
    this.target = undefined;
    return obj;
  }
});

var policies = [];
var inited = false;

var core = {
  registerPolicy: function (name, priority, checker, policy) {
    policies.push({
      name: name,
      priority: priority,
      policy: policy,
      checker: checker
    });
    policies.sort(function (p1, p2) {
      return p1.priority - p2.priority;
    });
    logger.info('register observe policy[%s], priority is %d', name, priority);
    return this;
  },
  init: function (cfg) {
    if (!inited) {
      configuration.config(cfg);
      if (_.each(policies, function (policy) {
        if (policy.checker(config)) {
          _.each(policy.policy(config), function (val, key) {
            Observer.prototype[key] = val;
          });
          config.policy = policy.name;
          logger.info('apply observe policy[%s], priority is %d', policy.name, policy.priority);
          return false;
        }
      }) !== false) throw Error('observer is not supported');
      inited = true;
    }
    return this;
  },
  on: function (obj, expr, handler) {
    var path = _.parseExpr(expr);

    if (path.length > 1) {
      var map = _.getOwnProp(obj, config.expressionKey),
          exp = map ? map[expr] : undefined;

      if (!exp) {
        exp = new Expression(obj, expr, path);
        if (!map) map = obj[config.expressionKey] = {};
        map[expr] = exp;
      }
      exp.on(handler);
      return exp.target;
    }
    return on(obj, expr, handler);
  },
  un: function (obj, expr, handler) {
    var path = _.parseExpr(expr);

    if (path.length > 1) {
      var map = _.getOwnProp(obj, config.expressionKey),
          exp = map ? map[expr] : undefined;

      if (exp) {
        arguments.length == 2 ? exp.un() : exp.un(handler);
        if (!exp.hasListen()) {
          map[expr] = undefined;
          return exp.destory();
        }
        return exp.target;
      }
      return proxy$1.proxy(obj) || obj;
    }
    return arguments.length == 2 ? un(obj, expr) : un(obj, expr, handler);
  },
  hasListen: function (obj, expr, handler) {
    var l = arguments.length;

    switch (l) {
      case 1:
        return hasListen(obj);
      case 2:
        if (_.isFunc(expr)) return hasListen(obj, expr);
    }

    var path = _.parseExpr(expr);

    if (path.length > 1) {
      var map = _.getOwnProp(obj, config.expressionKey),
          exp = map ? map[expr] : undefined;

      return exp ? l == 2 ? true : exp.hasListen(handler) : false;
    }
    return hasListen.apply(window, arguments);
  }
};

configuration.register({
  es6Proxy: true,
  es6SourceKey: '__ES6_PROXY_SOURCE__',
  es6ProxyKey: '__ES6_PROXY__'
});

var hasOwn$1 = Object.prototype.hasOwnProperty;

core.registerPolicy('ES6Proxy', 1, function (config) {
  return window.Proxy && config.es6Proxy !== false;
}, function (config) {
  var es6SourceKey = config.es6SourceKey;
  var es6ProxyKey = config.es6ProxyKey;


  proxy$1.enable({
    obj: function (obj) {
      if (obj && hasOwn$1.call(obj, es6SourceKey)) return obj[es6SourceKey];
      return obj;
    },
    eq: function (o1, o2) {
      return o1 === o2 || o1 && o2 && proxy$1.obj(o1) === proxy$1.obj(o2);
    },
    proxy: function (obj) {
      if (obj && hasOwn$1.call(obj, es6ProxyKey)) return obj[es6ProxyKey];
      return obj;
    }
  });

  return {
    _init: function () {
      this.obj = proxy$1.obj(this.target);
      this.es6proxy = false;
    },
    _destroy: function () {
      this.es6proxy = false;
      this.obj[es6ProxyKey] = undefined;
      proxy$1.change(this.obj, undefined);
    },
    _watch: function (attr) {
      if (!this.es6proxy) {
        var _proxy = this._objectProxy(),
            obj = this.obj;

        this.target = _proxy;
        obj[es6ProxyKey] = _proxy;
        obj[es6SourceKey] = obj;
        proxy$1.change(obj, _proxy);
        this.es6proxy = true;
      }
    },
    _unwatch: function (attr) {},
    _objectProxy: function () {
      var _this = this;

      return new Proxy(this.obj, {
        set: function (obj, prop, value) {
          if (_this.listens[prop]) {
            var oldVal = obj[prop];
            obj[prop] = value;
            _this._addChangeRecord(prop, oldVal);
          } else {
            obj[prop] = value;
          }
          return true;
        }
      });
    }
  };
});

var hasOwn$2 = Object.prototype.hasOwnProperty;
var RESERVE_PROPS = 'hasOwnProperty,toString,toLocaleString,isPrototypeOf,propertyIsEnumerable,valueOf'.split(',');
var RESERVE_ARRAY_PROPS = 'concat,copyWithin,entries,every,fill,filter,find,findIndex,forEach,indexOf,lastIndexOf,length,map,keys,join,pop,push,reverse,reverseRight,some,shift,slice,sort,splice,toSource,unshift'.split(',');
var VBClassFactory = _.dynamicClass({
  constBind: '__VB_CONST__',
  descBind: '__VB_PROXY__',
  classNameGenerator: 0,
  constructor: function (defProps, onProxyChange) {
    this.classPool = {};
    this.defPropMap = {};
    this.onProxyChange = onProxyChange;
    this.addDefProps(defProps);
    this.initConstScript();
  },
  setConstBind: function (constBind) {
    this.constBind = constBind;
    this.initConstScript();
  },
  setDescBind: function (descBind) {
    this.descBind = descBind;
    this.initConstScript();
  },
  addDefProps: function (defProps) {
    var defPropMap = this.defPropMap,
        props = [];

    _.each(defProps || [], function (prop) {
      defPropMap[prop] = true;
    });
    for (var prop in defPropMap) {
      if (hasOwn$2.call(defPropMap, prop)) props.push(prop);
    }
    this.defProps = props;
    this.initReserveProps();
  },
  initReserveProps: function () {
    this.reserveProps = RESERVE_PROPS.concat(this.defProps);
    this.reserveArrayProps = this.reserveProps.concat(RESERVE_ARRAY_PROPS);
    this.reservePropMap = _.reverseConvert(this.reserveProps);
    this.reserveArrayPropMap = _.reverseConvert(this.reserveArrayProps);
  },
  initConstScript: function () {
    this.constScript = ['\tPublic [', this.descBind, ']\r\n', '\tPublic Default Function [', this.constBind, '](desc)\r\n', '\t\tset [', this.descBind, '] = desc\r\n', '\t\tSet [', this.constBind, '] = Me\r\n', '\tEnd Function\r\n'].join('');
  },
  generateClassName: function () {
    return 'VBClass' + this.classNameGenerator++;
  },
  parseClassConstructorName: function (className) {
    return className + 'Constructor';
  },
  generateSetter: function (attr) {
    var descBind = this.descBind;

    return ['\tPublic Property Get [', attr, ']\r\n', '\tOn Error Resume Next\r\n', '\t\tSet[', attr, '] = [', descBind, '].get("', attr, '")\r\n', '\tIf Err.Number <> 0 Then\r\n', '\t\t[', attr, '] = [', descBind, '].get("', attr, '")\r\n', '\tEnd If\r\n', '\tOn Error Goto 0\r\n', '\tEnd Property\r\n'];
  },
  generateGetter: function (attr) {
    var descBind = this.descBind;

    return ['\tPublic Property Let [', attr, '](val)\r\n', '\t\tCall [', descBind, '].set("', attr, '",val)\r\n', '\tEnd Property\r\n', '\tPublic Property Set [', attr, '](val)\r\n', '\t\tCall [', descBind, '].set("', attr, '",val)\r\n', '\tEnd Property\r\n'];
  },
  generateClass: function (className, props, funcMap) {
    var _this = this;

    var buffer = ['Class ', className, '\r\n', this.constScript, '\r\n'];

    _.each(props, function (attr) {
      if (funcMap[attr]) {
        buffer.push('\tPublic [' + attr + ']\r\n');
      } else {
        buffer.push.apply(buffer, _this.generateSetter(attr));
        buffer.push.apply(buffer, _this.generateGetter(attr));
      }
    });
    buffer.push('End Class\r\n');
    return buffer.join('');
  },
  generateClassConstructor: function (props, funcMap, funcArray) {
    var key = [props.length, '[', props.join(','), ']', '[', funcArray.join(','), ']'].join(''),
        classConstName = this.classPool[key];

    if (classConstName) return classConstName;

    var className = this.generateClassName();
    classConstName = this.parseClassConstructorName(className);
    parseVB(this.generateClass(className, props, funcMap));
    parseVB(['Function ', classConstName, '(desc)\r\n', '\tDim o\r\n', '\tSet o = (New ', className, ')(desc)\r\n', '\tSet ', classConstName, ' = o\r\n', 'End Function'].join(''));
    this.classPool[key] = classConstName;
    return classConstName;
  },
  create: function (obj, desc) {
    var _this2 = this;

    var protoProps = void 0,
        protoPropMap = void 0,
        props = [],
        funcs = [],
        funcMap = {},
        descBind = this.descBind;

    function addProp(prop) {
      if (_.isFunc(obj[prop])) {
        funcMap[prop] = true;
        funcs.push(prop);
      }
      props.push(prop);
    }

    if (_.isArray(obj)) {
      protoProps = this.reserveArrayProps;
      protoPropMap = this.reserveArrayPropMap;
    } else {
      protoProps = this.reserveProps;
      protoPropMap = this.reservePropMap;
    }
    _.each(protoProps, addProp);
    _.each(obj, function (val, prop) {
      if (prop !== descBind && !(prop in protoPropMap)) addProp(prop);
    }, obj, false);

    if (!desc) {
      desc = this.descriptor(obj);
      if (desc) {
        obj = desc.obj;
      } else {
        desc = new ObjectDescriptor(obj, props, this);
      }
    }

    proxy = window[this.generateClassConstructor(props, funcMap, funcs)](desc);
    _.each(funcs, function (prop) {
      proxy[prop] = _this2.funcProxy(obj[prop], proxy);
    });
    desc.proxy = proxy;

    this.onProxyChange(obj, proxy);
    return proxy;
  },
  funcProxy: function (fn, proxy) {
    return function () {
      fn.apply(!this || this == window ? proxy : this, arguments);
    };
  },
  eq: function (o1, o2) {
    var d1 = this.descriptor(o1),
        d2 = this.descriptor(o2);

    if (d1) o1 = d1.obj;
    if (d2) o2 = d2.obj;
    return o1 === o2;
  },
  obj: function (obj) {
    var desc = this.descriptor(obj);

    return desc ? desc.obj : obj;
  },
  proxy: function (obj) {
    var desc = this.descriptor(obj);

    return desc ? desc.proxy : undefined;
  },
  isProxy: function (obj) {
    return hasOwn$2.call(obj, this.constBind);
  },
  descriptor: function (obj) {
    var descBind = this.descBind;

    return hasOwn$2.call(obj, descBind) ? obj[descBind] : undefined;
  },
  destroy: function (obj) {
    var desc = this.descriptor(obj);

    if (desc) {
      obj = desc.obj;
      this.onProxyChange(obj, undefined);
    }
    return obj;
  }
});

var ObjectDescriptor = _.dynamicClass({
  constructor: function (obj, props, classGenerator) {
    this.classGenerator = classGenerator;
    this.obj = obj;
    this.defines = _.reverseConvert(props, function () {
      return false;
    });
    obj[classGenerator.descBind] = this;
    this.accessorNR = 0;
  },
  isAccessor: function (desc) {
    return desc && (desc.get || desc.set);
  },
  hasAccessor: function () {
    return !!this.accessorNR;
  },
  defineProperty: function (attr, desc) {
    var defines = this.defines,
        obj = this.obj;

    if (!(attr in defines)) {
      if (!(attr in obj)) {
        obj[attr] = undefined;
      } else if (_.isFunc(obj[attr])) {
        console.warn('defineProperty not support function [' + attr + ']');
      }
      this.classGenerator.create(this.obj, this);
    }

    if (!this.isAccessor(desc)) {
      if (defines[attr]) {
        defines[attr] = false;
        this.accessorNR--;
      }
      obj[attr] = desc.value;
    } else {
      defines[attr] = desc;
      this.accessorNR++;
      if (desc.get) obj[attr] = desc.get();
    }
    return this.proxy;
  },
  getPropertyDefine: function (attr) {
    return this.defines[attr] || undefined;
  },
  get: function (attr) {
    var define = this.defines[attr];

    return define && define.get ? define.get.call(this.proxy) : this.obj[attr];
  },
  set: function (attr, value) {
    var define = this.defines[attr];

    if (define && define.set) define.set.call(this.proxy, value);
    this.obj[attr] = value;
  }
});

var supported = undefined;
VBClassFactory.isSupport = function isSupport() {
  if (supported !== undefined) return supported;
  supported = false;
  if (window.VBArray) {
    try {
      window.execScript(['Function parseVB(code)', '\tExecuteGlobal(code)', 'End Function'].join('\n'), 'VBScript');
      supported = true;
    } catch (e) {
      console.error(e.message, e);
    }
  }
  return supported;
};

configuration.register({
  defaultProps: []
});

var policy = {
  _init: function () {
    this.watchers = {};
  },
  _destroy: function () {
    for (var attr in this.watchers) {
      if (this.watchers[attr]) this._unwatch(attr);
    }
    this.watchers = undefined;
  },
  _watch: function (attr) {
    if (!this.watchers[attr]) {
      this._defineProperty(attr, this.obj[attr]);
      this.watchers[attr] = true;
    }
  },
  _unwatch: function (attr) {
    if (this.watchers[attr]) {
      this._undefineProperty(attr, this.obj[attr]);
    }
  }
};

core.registerPolicy('ES5DefineProperty', 10, function (config) {
  if (Object.defineProperty) {
    try {
      var _ret = function () {
        var val = void 0,
            obj = {};
        Object.defineProperty(obj, 'sentinel', {
          get: function () {
            return val;
          },
          set: function (value) {
            val = value;
          }
        });
        obj.sentinel = 1;
        return {
          v: obj.sentinel === val
        };
      }();

      if (typeof _ret === "object") return _ret.v;
    } catch (e) {}
  }
  return false;
}, function (config) {
  proxy$1.disable();
  return _.assignIf({
    _defineProperty: function (attr, value) {
      var _this = this;

      Object.defineProperty(this.target, attr, {
        enumerable: true,
        configurable: true,
        get: function () {
          return value;
        },
        set: function (val) {
          var oldVal = value;
          value = val;
          _this._addChangeRecord(attr, oldVal);
        }
      });
    },
    _undefineProperty: function (attr, value) {
      Object.defineProperty(this.target, attr, {
        enumerable: true,
        configurable: true,
        writable: true,
        value: value
      });
    }
  }, policy);
});

core.registerPolicy('DefineGetterAndSetter', 20, function (config) {
  return '__defineGetter__' in {};
}, function (config) {
  proxy$1.disable();
  return _.assignIf({
    _defineProperty: function (attr, value) {
      var _this2 = this;

      this.target.__defineGetter__(attr, function () {
        return value;
      });
      this.target.__defineSetter__(attr, function (val) {
        var oldVal = value;

        value = val;
        _this2._addChangeRecord(attr, oldVal);
      });
    },
    _undefineProperty: function (attr, value) {
      this.target.__defineGetter__(attr, function () {
        return value;
      });
      this.target.__defineSetter__(attr, function (val) {
        value = val;
      });
    }
  }, policy);
});

core.registerPolicy('VBScriptProxy', 30, function (config) {
  return VBClassFactory.isSupport();
}, function (config) {

  var init = policy._init,
      factory = void 0;

  proxy$1.enable({
    obj: function (obj) {
      return obj ? factory.obj(obj) : obj;
    },
    eq: function (o1, o2) {
      return o1 === o2 || o1 && o2 && factory.obj(o1) === factory.obj(o2);
    },
    proxy: function (obj) {
      return obj ? factory.proxy(obj) : obj;
    }
  });
  factory = core.vbfactory = new VBClassFactory([proxy$1.listenKey, config.observerKey, config.expressionKey].concat(config.defaultProps || []), proxy$1.change);

  return _.assignIf({
    _init: function () {
      init.call(this);
      this.obj = factory.obj(this.target);
    },
    _defineProperty: function (attr, value) {
      var _this3 = this;

      var obj = this.obj,
          desc = factory.descriptor(obj);

      if (!desc) desc = factory.descriptor(factory.create(obj));

      this.target = desc.defineProperty(attr, {
        set: function (val) {
          var oldVal = _this3.obj[attr];
          _this3.obj[attr] = val;
          _this3._addChangeRecord(attr, oldVal);
        }
      });
    },
    _undefineProperty: function (attr, value) {
      var obj = this.obj,
          desc = factory.descriptor(obj);

      if (desc) {
        this.target = desc.defineProperty(attr, {
          value: value
        });
        if (!desc.hasAccessor()) {
          this.target = factory.destroy(obj);
        }
      }
    }
  }, policy);
});

var index = _.assign({
  eq: function (o1, o2) {
    return proxy$1.eq(o1, o2);
  },
  obj: function (o) {
    return proxy$1.obj(o);
  },
  onproxy: function (o, h) {
    return proxy$1.on(o, h);
  },
  unproxy: function (o, h) {
    return proxy$1.un(o, h);
  },

  proxy: proxy$1,
  config: configuration.get()
}, _, core);

return index;

}));
//# sourceMappingURL=observer.js.map