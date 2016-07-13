/*!
 * observer.js v0.2.6 built in Wed, 13 Jul 2016 06:45:07 GMT
 * Copyright (c) 2016 Tao Zeng <tao.zeng.zt@gmail.com>
 * Released under the MIT license
 * support IE6+ and other browsers
 * support ES6 Proxy and Object.observe
 * https://github.com/tao-zeng/observer.js
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("utility"));
	else if(typeof define === 'function' && define.amd)
		define(["utility"], factory);
	else if(typeof exports === 'object')
		exports["observer"] = factory(require("utility"));
	else
		root["observer"] = factory(root["utility"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "http://localhost:8088/dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(1),
	    observer = __webpack_require__(2),
	    _proxy = __webpack_require__(3),
	    configuration = __webpack_require__(4);
	
	__webpack_require__(6);
	__webpack_require__(7);
	
	_.assignIf(observer, _, {
	  eq: function eq(o1, o2) {
	    return _proxy.eq(o1, o2);
	  },
	  obj: function obj(o) {
	    return _proxy.obj(o);
	  },
	  onproxy: function onproxy(o, h) {
	    return _proxy.on(o, h);
	  },
	  unproxy: function unproxy(o, h) {
	    return _proxy.un(o, h);
	  },
	
	  proxy: _proxy,
	  config: configuration.get()
	});
	
	module.exports = observer;

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var proxy = __webpack_require__(3);
	var vbproxy = __webpack_require__(5);
	var _ = __webpack_require__(1);
	var timeoutframe = _.timeoutframe;
	var configuration = __webpack_require__(4);
	var config = configuration.cfg;
	
	configuration.register({
	  lazy: true,
	  animationFrame: true,
	  observerKey: '__OBSERVER__',
	  expressionKey: '__EXPR_OBSERVER__'
	});
	
	function abstractFunc() {}
	
	var Observer = _.dynamicClass({
	  constructor: function constructor(target) {
	    this.isArray = _.isArray(target);
	    if (!this.isArray && !_.isObject(target)) throw TypeError('can not observe object[' + Object.prototype.toString.call(target) + ']');
	    this.target = target;
	    this.obj = target;
	    this.listens = {};
	    this.changeRecords = {};
	    this._notify = this._notify.bind(this);
	    this.watchPropNum = 0;
	    this._init();
	  },
	  _fire: function _fire(attr, val, oldVal) {
	    var _this = this;
	
	    var handlers = void 0;
	
	    if (proxy.eq(val, oldVal) && !(this.isArray && attr === 'length')) return;
	    if (!(handlers = this.listens[attr])) return;
	
	    _.each(handlers.slice(), function (handler) {
	      handler(attr, val, oldVal, _this.target);
	    });
	  },
	  _notify: function _notify() {
	    var _this2 = this;
	
	    var obj = this.obj;
	
	    _.each(this.changeRecords, function (val, attr) {
	      _this2._fire(attr, obj[attr], val);
	    });
	    this.request_frame = undefined;
	    this.changeRecords = {};
	  },
	  _addChangeRecord: function _addChangeRecord(attr, oldVal) {
	    if (!config.lazy) {
	      this._fire(attr, this.obj[attr], oldVal);
	    } else if (!(attr in this.changeRecords)) {
	      this.changeRecords[attr] = oldVal;
	      if (!this.request_frame) {
	        this.request_frame = config.animationFrame ? window.requestAnimationFrame(this._notify) : timeoutframe.request(this._notify);
	      }
	    }
	  },
	  checkHandler: function checkHandler(handler) {
	    if (!_.isFunc(handler)) throw TypeError('Invalid Observe Handler');
	  },
	  hasListen: function hasListen(attr, handler) {
	    switch (arguments.length) {
	      case 0:
	        return !!this.watchPropNum;
	      case 1:
	        if (_.isFunc(attr)) {
	          return !_.each(this.listens, function (handlers) {
	            return _.lastIndexOf(handlers, attr) !== -1;
	          });
	        }
	        return !!listens[attr];
	      default:
	        this.checkHandler(handler);
	        return _.lastIndexOf(listens[attr], handler) !== -1;
	    }
	  },
	  on: function on(attr, handler) {
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
	  _cleanListen: function _cleanListen(attr) {
	    this.listens[attr] = undefined;
	    this.watchPropNum--;
	    this._unwatch(attr);
	  },
	  un: function un(attr, handler) {
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
	  destroy: function destroy() {
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
	
	  _init: abstractFunc,
	  _destroy: abstractFunc,
	  _watch: abstractFunc,
	  _unwatch: abstractFunc
	});
	
	function _hasListen(obj, attr, handler) {
	  var observer = _.getOwnProp(obj, config.observerKey);
	
	  return observer ? arguments.length == 1 ? observer.hasListen() : arguments.length == 2 ? observer.hasListen(attr) : observer.hasListen(attr, handler) : false;
	}
	
	function _on(obj, attr, handler) {
	  var observer = _.getOwnProp(obj, config.observerKey);
	
	  if (!observer) {
	    obj = proxy.obj(obj);
	    observer = new Observer(obj);
	    obj[config.observerKey] = observer;
	  }
	  return observer.on(attr, handler);
	}
	
	function _un(obj, attr, handler) {
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
	  constructor: function constructor(target, expr, path) {
	    this.id = expressionIdGenerator++;
	    this.expr = expr;
	    this.handlers = [];
	    this.observers = [];
	    this.path = path || _.parseExpr(expr);
	    this.observeHandlers = this._initObserveHandlers();
	    this.obj = proxy.obj(target);
	    this.target = this._observe(this.obj, 0);
	    this._onTargetProxy = this._onTargetProxy.bind(this);
	    proxy.on(target, this._onTargetProxy);
	  },
	  _onTargetProxy: function _onTargetProxy(obj, proxy) {
	    this.target = proxy;
	  },
	  _observe: function _observe(obj, idx) {
	    var prop = this.path[idx],
	        o = void 0;
	
	    if (idx + 1 < this.path.length && (o = obj[prop])) obj[prop] = this._observe(proxy.obj(o), idx + 1);
	    return _on(obj, prop, this.observeHandlers[idx]);
	  },
	  _unobserve: function _unobserve(obj, idx) {
	    var prop = this.path[idx],
	        o = void 0,
	        ret = void 0;
	
	    ret = _un(obj, prop, this.observeHandlers[idx]);
	    if (idx + 1 < this.path.length && (o = obj[prop])) obj[prop] = this._unobserve(proxy.obj(o), idx + 1);
	    return ret;
	  },
	  _initObserveHandlers: function _initObserveHandlers() {
	    return _.map(this.path, function (prop, i) {
	      return this._createObserveHandler(i);
	    }, this);
	  },
	  _createObserveHandler: function _createObserveHandler(idx) {
	    var _this3 = this;
	
	    var path = this.path.slice(0, idx + 1),
	        rpath = this.path.slice(idx + 1),
	        ridx = this.path.length - idx - 1;
	
	    return function (prop, val, oldVal) {
	      if (ridx) {
	        if (oldVal) {
	          oldVal = proxy.obj(oldVal);
	          _this3._unobserve(oldVal, idx + 1);
	          oldVal = _.get(oldVal, rpath);
	        } else {
	          oldVal = undefined;
	        }
	        if (val) {
	          val = proxy.obj(val);
	          _this3._observe(val, idx + 1);
	          val = _.get(val, rpath);
	        } else {
	          val = undefined;
	        }
	        if (proxy.eq(val, oldVal)) return;
	      }
	      _.each(_this3.handlers.slice(), function (h) {
	        h(this.expr, val, oldVal, this.target);
	      }, _this3);
	    };
	  },
	  checkHandler: function checkHandler(handler) {
	    if (!_.isFunc(handler)) throw TypeError('Invalid Observe Handler');
	  },
	  on: function on(handler) {
	    this.checkHandler(handler);
	    this.handlers.push(handler);
	    return this;
	  },
	  un: function un(handler) {
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
	  hasListen: function hasListen(handler) {
	    return arguments.length ? _.lastIndexOf(this.handlers, handler) != -1 : !!this.handlers.length;
	  },
	  destory: function destory() {
	    proxy.un(this.target, this._onTargetProxy);
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
	
	var policies = [],
	    policyNames = {};
	
	var inited = false;
	
	module.exports = {
	  registerPolicy: function registerPolicy(name, priority, checker, policy) {
	    policies.push({
	      name: name,
	      priority: priority,
	      policy: policy,
	      checker: checker
	    });
	    policies.sort(function (p1, p2) {
	      return p1.priority - p2.priority;
	    });
	    return this;
	  },
	  init: function init(cfg) {
	    if (!inited) {
	      configuration.config(cfg);
	      if (_.each(policies, function (policy) {
	        if (policy.checker(config)) {
	          _.each(policy.policy(config), function (val, key) {
	            Observer.prototype[key] = val;
	          });
	          config.policy = policy.name;
	          return false;
	        }
	      }) !== false) throw Error('not supported');
	      inited = true;
	    }
	    return this;
	  },
	  on: function on(obj, expr, handler) {
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
	    return _on(obj, expr, handler);
	  },
	  un: function un(obj, expr, handler) {
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
	      return proxy.proxy(obj) || obj;
	    }
	    return arguments.length == 2 ? _un(obj, expr) : _un(obj, expr, handler);
	  },
	  hasListen: function hasListen(obj, expr, handler) {
	    var l = arguments.length;
	
	    switch (l) {
	      case 1:
	        return _hasListen(obj);
	      case 2:
	        if (_.isFunc(expr)) return _hasListen(obj, expr);
	    }
	
	    var path = _.parseExpr(expr);
	
	    if (path.length > 1) {
	      var map = _.getOwnProp(obj, config.expressionKey),
	          exp = map ? map[expr] : undefined;
	
	      return exp ? l == 2 ? true : exp.hasListen(handler) : false;
	    }
	    return _hasListen.apply(window, arguments);
	  }
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var toStr = Object.prototype.toString;
	var _ = __webpack_require__(1);
	var hasOwnProp = _.hasOwnProp;
	var configuration = __webpack_require__(4);
	var LISTEN_CONFIG = 'proxyListenKey';
	
	configuration.register(LISTEN_CONFIG, '__PROXY_LISTENERS__');
	
	var defaultPolicy = {
	  eq: function eq(o1, o2) {
	    return o1 === o2;
	  },
	  obj: function obj(o) {
	    return o;
	  },
	  proxy: function proxy(o) {
	    return o;
	  }
	},
	    apply = {
	  change: function change(obj, p) {
	    var handlers = _.getOwnProp(obj, configuration.get(LISTEN_CONFIG));
	
	    if (handlers) {
	      var i = handlers.length;
	      while (i--) {
	        handlers[i](obj, p);
	      }
	    }
	  },
	  on: function on(obj, handler) {
	    if (!_.isFunc(handler)) throw TypeError('Invalid Proxy Event Handler[' + handler);
	    var key = configuration.get(LISTEN_CONFIG),
	        handlers = _.getOwnProp(obj, key);
	
	    if (!handlers) obj[key] = handlers = [];
	    handlers.push(handler);
	  },
	  un: function un(obj, handler) {
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
	  clean: function clean(obj) {
	    if (obj[proxy.listenKey]) obj[proxy.listenKey] = undefined;
	  }
	};
	
	function proxy(o) {
	  return proxy.proxy(o);
	}
	
	_.assign(proxy, {
	  isEnable: function isEnable() {
	    return policy === defaultPolicy;
	  },
	  enable: function enable(policy) {
	    applyPolicy(policy);
	  },
	  disable: function disable() {
	    applyPolicy(defaultPolicy);
	  }
	});
	
	function applyPolicy(policy) {
	  var _apply = policy !== defaultPolicy ? function (fn, name) {
	    proxy[name] = fn;
	  } : function (fn, name) {
	    proxy[name] = _.emptyFunc;
	  };
	  _.each(apply, _apply);
	  _.each(policy, function (fn, name) {
	    proxy[name] = fn;
	  });
	}
	
	proxy.disable();
	
	_.get = function (obj, expr, defVal, lastOwn, own) {
	  var i = 0,
	      path = _.parseExpr(expr, true),
	      l = path.length - 1,
	      prop = void 0;
	
	  while (!_.isNil(obj) && i < l) {
	    prop = path[i++];
	    obj = proxy.obj(obj);
	    if (own && !hasOwnProp(obj, prop)) return defVal;
	    obj = obj[prop];
	  }
	  obj = proxy.obj(obj);
	  prop = path[i];
	  return i == l && !_.isNil(obj) && (own ? hasOwnProp(obj, prop) : prop in obj) ? obj[prop] : defVal;
	};
	
	_.hasOwnProp = function (obj, prop) {
	  return hasOwnProp(proxy.obj(obj), prop);
	};
	module.exports = proxy;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _require = __webpack_require__(1);
	
	var Configuration = _require.Configuration;
	
	
	module.exports = new Configuration();

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(1),
	    hasOwn = Object.prototype.hasOwnProperty,
	    RESERVE_PROPS = 'hasOwnProperty,toString,toLocaleString,isPrototypeOf,propertyIsEnumerable,valueOf'.split(','),
	    RESERVE_ARRAY_PROPS = 'concat,copyWithin,entries,every,fill,filter,find,findIndex,forEach,indexOf,lastIndexOf,length,map,keys,join,pop,push,reverse,reverseRight,some,shift,slice,sort,splice,toSource,unshift'.split(',');
	
	var VBClassFactory = _.dynamicClass({
	  constBind: '__VB_CONST__',
	  descBind: '__VB_PROXY__',
	  classNameGenerator: 0,
	  constructor: function constructor(defProps, onProxyChange) {
	    this.classPool = {};
	    this.defPropMap = {};
	    this.onProxyChange = onProxyChange;
	    this.addDefProps(defProps);
	    this.initConstScript();
	  },
	  setConstBind: function setConstBind(constBind) {
	    this.constBind = constBind;
	    this.initConstScript();
	  },
	  setDescBind: function setDescBind(descBind) {
	    this.descBind = descBind;
	    this.initConstScript();
	  },
	  addDefProps: function addDefProps(defProps) {
	    var defPropMap = this.defPropMap;
	
	    _.each(defProps || [], function (prop) {
	      defPropMap[prop] = true;
	    });
	    this.defProps = _.keys(defPropMap);
	    this.initReserveProps();
	  },
	  initReserveProps: function initReserveProps() {
	    this.reserveProps = RESERVE_PROPS.concat(_.keys(this.defPropMap) || []);
	    this.reserveArrayProps = this.reserveProps.concat(RESERVE_ARRAY_PROPS);
	    this.reservePropMap = _.reverseConvert(this.reserveProps);
	    this.reserveArrayPropMap = _.reverseConvert(this.reserveArrayProps);
	  },
	  initConstScript: function initConstScript() {
	    this.constScript = ['\tPublic [', this.descBind, ']\r\n', '\tPublic Default Function [', this.constBind, '](desc)\r\n', '\t\tset [', this.descBind, '] = desc\r\n', '\t\tSet [', this.constBind, '] = Me\r\n', '\tEnd Function\r\n'].join('');
	  },
	  generateClassName: function generateClassName() {
	    return 'VBClass' + this.classNameGenerator++;
	  },
	  parseClassConstructorName: function parseClassConstructorName(className) {
	    return className + 'Constructor';
	  },
	  generateSetter: function generateSetter(attr) {
	    var descBind = this.descBind;
	
	    return ['\tPublic Property Get [', attr, ']\r\n', '\tOn Error Resume Next\r\n', '\t\tSet[', attr, '] = [', descBind, '].get("', attr, '")\r\n', '\tIf Err.Number <> 0 Then\r\n', '\t\t[', attr, '] = [', descBind, '].get("', attr, '")\r\n', '\tEnd If\r\n', '\tOn Error Goto 0\r\n', '\tEnd Property\r\n'];
	  },
	  generateGetter: function generateGetter(attr) {
	    var descBind = this.descBind;
	
	    return ['\tPublic Property Let [', attr, '](val)\r\n', '\t\tCall [', descBind, '].set("', attr, '",val)\r\n', '\tEnd Property\r\n', '\tPublic Property Set [', attr, '](val)\r\n', '\t\tCall [', descBind, '].set("', attr, '",val)\r\n', '\tEnd Property\r\n'];
	  },
	  generateClass: function generateClass(className, props, funcMap) {
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
	  generateClassConstructor: function generateClassConstructor(props, funcMap, funcArray) {
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
	  create: function create(obj, desc) {
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
	  funcProxy: function funcProxy(fn, proxy) {
	    return function () {
	      fn.apply(!this || this == window ? proxy : this, arguments);
	    };
	  },
	  eq: function eq(o1, o2) {
	    var d1 = this.descriptor(o1),
	        d2 = this.descriptor(o2);
	
	    if (d1) o1 = d1.obj;
	    if (d2) o2 = d2.obj;
	    return o1 === o2;
	  },
	  obj: function obj(_obj) {
	    var desc = this.descriptor(_obj);
	
	    return desc ? desc.obj : _obj;
	  },
	  proxy: function proxy(obj) {
	    var desc = this.descriptor(obj);
	
	    return desc ? desc.proxy : undefined;
	  },
	  isProxy: function isProxy(obj) {
	    return hasOwn.call(obj, this.constBind);
	  },
	  descriptor: function descriptor(obj) {
	    var descBind = this.descBind;
	
	    return hasOwn.call(obj, descBind) ? obj[descBind] : undefined;
	  },
	  destroy: function destroy(obj) {
	    var desc = this.descriptor(obj);
	
	    if (desc) {
	      obj = desc.obj;
	      this.onProxyChange(obj, undefined);
	    }
	    return obj;
	  }
	});
	
	var ObjectDescriptor = _.dynamicClass({
	  constructor: function constructor(obj, props, classGenerator) {
	    this.classGenerator = classGenerator;
	    this.obj = obj;
	    this.defines = _.reverseConvert(props, function () {
	      return false;
	    });
	    obj[classGenerator.descBind] = this;
	    this.accessorNR = 0;
	  },
	  isAccessor: function isAccessor(desc) {
	    return desc && (desc.get || desc.set);
	  },
	  hasAccessor: function hasAccessor() {
	    return !!this.accessorNR;
	  },
	  defineProperty: function defineProperty(attr, desc) {
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
	  getPropertyDefine: function getPropertyDefine(attr) {
	    return this.defines[attr] || undefined;
	  },
	  get: function get(attr) {
	    var define = this.defines[attr];
	
	    return define && define.get ? define.get.call(this.proxy) : this.obj[attr];
	  },
	  set: function set(attr, value) {
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
	module.exports = VBClassFactory;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var core = __webpack_require__(2),
	    proxy = __webpack_require__(3),
	    _ = __webpack_require__(1),
	    configuration = __webpack_require__(4);
	
	configuration.register({
	  es6Proxy: true,
	  es6SourceKey: '__ES6_PROXY_SOURCE__',
	  es6ProxyKey: '__ES6_PROXY__'
	});
	
	core.registerPolicy('ES6Proxy', 1, function (config) {
	  return window.Proxy && config.es6Proxy !== false;
	}, function (config) {
	  var es6SourceKey = config.es6SourceKey;
	  var es6ProxyKey = config.es6ProxyKey;
	
	
	  proxy.enable({
	    obj: function obj(_obj) {
	      return _obj ? _.getOwnProp(_obj, es6SourceKey) || _obj : _obj;
	    },
	    eq: function eq(o1, o2) {
	      return o1 === o2 || o1 && o2 && proxy.obj(o1) === proxy.obj(o2);
	    },
	    proxy: function proxy(obj) {
	      return obj ? _.getOwnProp(obj, es6ProxyKey) : undefined;
	    }
	  });
	
	  return {
	    _init: function _init() {
	      this.obj = proxy.obj(this.target);
	      this.es6proxy = false;
	    },
	    _destroy: function _destroy() {
	      this.es6proxy = false;
	      this.obj[es6ProxyKey] = undefined;
	      proxy.change(this.obj, undefined);
	    },
	    _watch: function _watch(attr) {
	      if (!this.es6proxy) {
	        var _proxy = this.isArray ? this._arrayProxy() : this._objectProxy(),
	            obj = this.obj;
	
	        this.target = _proxy;
	        obj[es6ProxyKey] = _proxy;
	        obj[es6SourceKey] = obj;
	        proxy.change(obj, _proxy);
	        this.es6proxy = true;
	      }
	    },
	    _unwatch: function _unwatch(attr) {},
	    _arrayProxy: function _arrayProxy() {
	      var _this = this;
	
	      var oldLength = this.target.length;
	
	      return new Proxy(this.obj, {
	        set: function set(obj, prop, value) {
	          if (_this.listens[prop]) {
	            var oldVal = void 0;
	
	            if (prop === 'length') {
	              oldVal = oldLength;
	              oldLength = value;
	            } else {
	              oldVal = obj[prop];
	            }
	            obj[prop] = value;
	            if (value !== oldVal) _this._addChangeRecord(prop, oldVal);
	          } else {
	            obj[prop] = value;
	          }
	          return true;
	        }
	      });
	    },
	    _objectProxy: function _objectProxy() {
	      var _this2 = this;
	
	      return new Proxy(this.obj, {
	        set: function set(obj, prop, value) {
	          if (_this2.listens[prop]) {
	            var oldVal = obj[prop];
	
	            obj[prop] = value;
	            if (value !== oldVal) _this2._addChangeRecord(prop, oldVal);
	          } else {
	            obj[prop] = value;
	          }
	          return true;
	        }
	      });
	    }
	  };
	});

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var core = __webpack_require__(2),
	    proxyPro = __webpack_require__(3),
	    VBClassFactory = __webpack_require__(5),
	    _ = __webpack_require__(1),
	    arrayHockMethods = ['push', 'pop', 'shift', 'unshift', 'sort', 'reverse', 'splice'],
	    policy = {
	  _init: function _init() {
	    this.watchers = {};
	  },
	  _destroy: function _destroy() {
	    for (var attr in this.watchers) {
	      if (this.watchers[attr]) this._unwatch(attr);
	    }
	    this.watchers = undefined;
	  },
	  _hockArrayLength: function _hockArrayLength(method) {
	    var self = this;
	
	    this.obj[method] = function () {
	      var len = this.length;
	
	      Array.prototype[method].apply(this, arguments);
	      if (self.obj.length != len) self._addChangeRecord('length', len);
	    };
	  },
	  _watch: function _watch(attr) {
	    var _this = this;
	
	    if (!this.watchers[attr]) {
	      if (this.isArray && attr === 'length') {
	        _.each(arrayHockMethods, function (method) {
	          _this._hockArrayLength(method);
	        });
	      } else {
	        this._defineProperty(attr, this.obj[attr]);
	      }
	      this.watchers[attr] = true;
	    }
	  },
	  _unwatch: function _unwatch(attr) {
	    var _this2 = this;
	
	    if (this.watchers[attr]) {
	      if (this.isArray && attr === 'length') {
	        _.each(arrayHockMethods, function (method) {
	          delete _this2.obj[method];
	        });
	      } else {
	        this._undefineProperty(attr, this.obj[attr]);
	      }
	      this.watchers[attr] = false;
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
	          get: function get() {
	            return val;
	          },
	          set: function set(value) {
	            val = value;
	          }
	        });
	        obj.sentinel = 1;
	        return {
	          v: obj.sentinel === val
	        };
	      }();
	
	      if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
	    } catch (e) {}
	  }
	  return false;
	}, function (config) {
	  proxyPro.disable();
	  return _.assignIf({
	    _defineProperty: function _defineProperty(attr, value) {
	      var _this3 = this;
	
	      Object.defineProperty(this.target, attr, {
	        enumerable: true,
	        configurable: true,
	        get: function get() {
	          return value;
	        },
	        set: function set(val) {
	          var oldVal = value;
	
	          value = val;
	          _this3._addChangeRecord(attr, oldVal);
	        }
	      });
	    },
	    _undefineProperty: function _undefineProperty(attr, value) {
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
	  proxyPro.disable();
	  return _.assignIf({
	    _defineProperty: function _defineProperty(attr, value) {
	      var _this4 = this;
	
	      this.target.__defineGetter__(attr, function () {
	        return value;
	      });
	      this.target.__defineSetter__(attr, function (val) {
	        var oldVal = value;
	
	        value = val;
	        _this4._addChangeRecord(attr, oldVal);
	      });
	    },
	    _undefineProperty: function _undefineProperty(attr, value) {
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
	
	  proxyPro.enable({
	    obj: function obj(_obj) {
	      return _obj ? factory.obj(_obj) : _obj;
	    },
	    eq: function eq(o1, o2) {
	      return o1 === o2 || o1 && o2 && factory.obj(o1) === factory.obj(o2);
	    },
	    proxy: function proxy(obj) {
	      return obj ? factory.proxy(obj) : undefined;
	    }
	  });
	  factory = core.vbfactory = new VBClassFactory([proxyPro.listenKey, config.observerKey, config.expressionKey], proxyPro.change);
	
	  return _.assignIf({
	    _init: function _init() {
	      init.call(this);
	      this.obj = factory.obj(this.target);
	    },
	    _defineProperty: function _defineProperty(attr, value) {
	      var _this5 = this;
	
	      var obj = this.obj,
	          desc = factory.descriptor(obj);
	
	      if (!desc) desc = factory.descriptor(factory.create(obj));
	
	      this.target = desc.defineProperty(attr, {
	        set: function set(val) {
	          var oldVal = _this5.obj[attr];
	          _this5.obj[attr] = val;
	          _this5._addChangeRecord(attr, oldVal);
	        }
	      });
	    },
	    _undefineProperty: function _undefineProperty(attr, value) {
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

/***/ }
/******/ ])
});
;
//# sourceMappingURL=observer.js.map