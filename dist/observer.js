/*!
 * observer.js v0.0.8 built in Fri, 18 Mar 2016 12:53:21 GMT
 * Copyright (c) 2016 Tao Zeng <tao.zeng.zt@gmail.com>
 * Released under the MIT license
 * support IE6+ and other browsers
 * support ES6 Proxy and Object.observe
 * https://github.com/tao-zeng/observer.js
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["observer"] = factory();
	else
		root["observer"] = factory();
})(this, function() {
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
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _require = __webpack_require__(1);
	
	var proxy = _require.proxy;
	var Exp = __webpack_require__(4);
	var exp = __webpack_require__(8);
	var Observer = __webpack_require__(6);
	
	window.observer = {
	  on: exp.on,
	  un: exp.un,
	  hasListen: exp.hasListen,
	  obj: function obj(_obj) {
	    return proxy.obj(_obj);
	  },
	  eq: function eq(obj1, obj2) {
	    return proxy.eq(obj1, obj2);
	  },
	
	  proxy: proxy,
	  util: __webpack_require__(3),
	  Map: __webpack_require__(2),
	  VBProxyFactory: Observer.VBProxyFactory,
	  setConfig: Observer.setConfig,
	  config: function config() {
	    return Observer.config;
	  },
	  policy: function policy() {
	    return Observer.policy;
	  }
	};
	module.exports = window.observer;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports.proxyEnable = proxyEnable;
	exports.proxyDisable = proxyDisable;
	exports.proxyChange = proxyChange;
	var Map = __webpack_require__(2),
	    _ = __webpack_require__(3);
	
	var proxyEvents = new Map();
	
	function empty() {}
	
	function default_equal(obj1, obj2) {
	  return obj1 === obj2;
	}
	
	function default_obj(obj) {
	  return obj;
	}
	
	function default_proxy(obj) {
	  return obj;
	}
	
	function bind(obj, handler) {
	  var handlers = undefined;
	
	  if (typeof handler !== 'function') {
	    throw TypeError('Invalid Proxy Event Handler');
	  }
	  obj = proxy.obj(obj);
	  handlers = proxyEvents.get(obj);
	  if (!handlers) {
	    handlers = [];
	    proxyEvents.set(obj, handlers);
	  }
	  handlers.push(handler);
	}
	
	function unbind(obj, handler) {
	  var handlers = undefined;
	
	  obj = proxy.obj(obj);
	  handlers = proxyEvents.get(obj);
	  if (handlers) {
	    if (arguments.length > 1) {
	      if (typeof handler === 'function') {
	        var idx = _.indexOf.call(handlers, handler);
	        if (idx != -1) {
	          handlers.splice(idx, 1);
	        }
	      }
	    } else {
	      proxyEvents['delete'](obj);
	    }
	  }
	}
	
	var proxy = exports.proxy = {};
	
	function proxyEnable() {
	  proxy.on = bind;
	  proxy.un = unbind;
	  proxy.eq = undefined;
	  proxy.obj = undefined;
	  proxy.proxy = undefined;
	}
	
	function proxyDisable() {
	  proxy.on = empty;
	  proxy.un = empty;
	  proxy.eq = default_equal;
	  proxy.obj = default_obj;
	  proxy.proxy = default_proxy;
	}
	
	function proxyChange(obj, proxy) {
	  var handlers = proxyEvents.get(obj);
	  if (handlers) {
	    for (var i = handlers.length - 1; i >= 0; i--) {
	      handlers[i](obj, proxy);
	    }
	  }
	}

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Map = window.Map;
	
	if (!Map) {
	  (function () {
	    var ITERATOR_TYPE = {
	      KEY: 'key',
	      VALUE: 'value',
	      ENTRY: 'entry'
	    },
	        HASH_BIND = '__hash__',
	        hash_generator = 0;
	
	    var _Map = function () {
	      function _Map() {
	        _classCallCheck(this, _Map);
	
	        this._map = {};
	        this._keyMap = {};
	        this._size = 0;
	      }
	
	      _Map.prototype._hash = function _hash(value) {
	        return value[HASH_BIND] || (value[HASH_BIND] = ++hash_generator);
	      };
	
	      _Map.prototype.has = function has(key) {
	        return this._hash(key) in this._keyMap;
	      };
	
	      _Map.prototype.get = function get(key) {
	        var hcode = this._hash(key);
	        if (hcode in this._keyMap) {
	          return this._map[hcode];
	        }
	        return undefined;
	      };
	
	      _Map.prototype.set = function set(key, val) {
	        var hcode = this._hash(key);
	        this._keyMap[hcode] = key;
	        this._map[hcode] = val;
	        if (!(hcode in this._keyMap)) {
	          this._size++;
	        }
	        return this;
	      };
	
	      _Map.prototype['delete'] = function _delete(key) {
	        var hcode = this._hash(key);
	        if (hcode in this._keyMap) {
	          delete this._keyMap[hcode];
	          delete this._map[hcode];
	          this._size--;
	          return true;
	        }
	        return false;
	      };
	
	      _Map.prototype.size = function size() {
	        return this._size;
	      };
	
	      _Map.prototype.clear = function clear() {
	        this._keyMap = {};
	        this._map = {};
	        this._size = 0;
	      };
	
	      _Map.prototype.forEach = function forEach(callback) {
	        for (var key in this._map) {
	          if (key in this._keyMap) callback(this._map[key], key, this);
	        }
	      };
	
	      _Map.prototype.keys = function keys() {
	        return new MapIterator(this, ITERATOR_TYPE.KEY);
	      };
	
	      _Map.prototype.values = function values() {
	        return new MapIterator(this, ITERATOR_TYPE.VALUE);
	      };
	
	      _Map.prototype.entries = function entries() {
	        return new MapIterator(this, ITERATOR_TYPE.ENTRY);
	      };
	
	      _Map.prototype.toString = function toString() {
	        return '[Object Map]';
	      };
	
	      return _Map;
	    }();
	
	    var MapIterator = function () {
	      function MapIterator(map, type) {
	        _classCallCheck(this, MapIterator);
	
	        this._index = 0;
	        this._map = map;
	        this._type = type;
	        this._hashs = [];
	        for (var h in map._map) {
	          this._hashs.push(h);
	        }
	      }
	
	      MapIterator.prototype.next = function next() {
	        var val = undefined;
	        if (this._index < this._hashs.length) {
	          var hash = this._hashs[this.index++];
	          switch (this._type) {
	            case ITERATOR_TYPE.KEY:
	              val = this._map._keyMap[hash];
	            case ITERATOR_TYPE.VALUE:
	              val = this._map._map[hash];
	            case ITERATOR_TYPE.ENTRY:
	              val = [this._map._keyMap[hash], this._map._map[hash]];
	            default:
	              throw new TypeError('Invalid iterator type');
	          }
	        }
	        return {
	          value: val,
	          done: this._index >= this._keys.length
	        };
	      };
	
	      MapIterator.prototype.toString = function toString() {
	        return '[object Map Iterator]';
	      };
	
	      return MapIterator;
	    }();
	
	    Map = _Map;
	    Map.HASH_BIND = HASH_BIND;
	  })();
	}
	module.exports = Map;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var lastTime = undefined,
	    requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame,
	    cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame,
	    bind = Function.prototype.bind || function bind(scope) {
	  if (arguments.length < 2 && (scope === undefined || scope === null)) {
	    return this;
	  }
	  var fn = this,
	      args = Array.prototype.slice.call(arguments, 1);
	  return function () {
	    return fn.apply(scope, args.concat(Array.prototype.slice.call(arguments)));
	  };
	};
	
	function requestTimeoutFrame(callback) {
	  var currTime = new Date().getTime(),
	      timeToCall = Math.max(0, 16 - (currTime - lastTime)),
	      reqId = setTimeout(function () {
	    callback(currTime + timeToCall);
	  }, timeToCall);
	  lastTime = currTime + timeToCall;
	  return reqId;
	}
	
	function cancelTimeoutFrame(reqId) {
	  clearTimeout(reqId);
	}
	
	if (requestAnimationFrame && cancelAnimationFrame) {
	  requestAnimationFrame = bind.call(requestAnimationFrame, window);
	  cancelAnimationFrame = bind.call(cancelAnimationFrame, window);
	} else {
	  requestAnimationFrame = requestTimeoutFrame;
	  cancelAnimationFrame = cancelTimeoutFrame;
	}
	
	var propNameReg = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g,
	    escapeCharReg = /\\(\\)?/g;
	
	var exprCache = {};
	
	function parseExpr(exp) {
	  if (exp instanceof Array) {
	    return exp;
	  } else {
	    var _ret = function () {
	      var result = exprCache[exp];
	      if (!result) {
	        result = exprCache[exp] = [];
	        (exp + '').replace(propNameReg, function (match, number, quote, string) {
	          result.push(quote ? string.replace(escapeCharReg, '$1') : number || match);
	        });
	      }
	      return {
	        v: result
	      };
	    }();
	
	    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
	  }
	}
	
	var util = {
	  requestTimeoutFrame: requestTimeoutFrame,
	
	  cancelTimeoutFrame: cancelTimeoutFrame,
	
	  requestAnimationFrame: requestAnimationFrame,
	
	  cancelAnimationFrame: cancelAnimationFrame,
	
	  bind: bind,
	
	  indexOf: Array.prototype.indexOf || function indexOf(val) {
	    for (var i = 0, l = this.length; i < l; i++) {
	      if (this[i] === val) {
	        return i;
	      }
	    }
	    return -1;
	  },
	
	  parseExpr: parseExpr,
	
	  get: function get(object, path, defaultValue) {
	    if (object) {
	      path = parseExpr(path);
	      var index = 0,
	          l = path.length;
	
	      while (object && index < l) {
	        object = object[path[index++]];
	      }
	      return index == l ? object : defaultValue;
	    }
	    return defaultValue;
	  }
	};
	
	module.exports = util;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var observer = __webpack_require__(5);
	
	var _require = __webpack_require__(1);
	
	var proxy = _require.proxy;
	var _ = __webpack_require__(3);
	var Expression = function () {
	  function Expression(target, expression, path) {
	    _classCallCheck(this, Expression);
	
	    if (!target || !(target instanceof Array || (typeof target === 'undefined' ? 'undefined' : _typeof(target)) == 'object')) {
	      throw TypeError('can not observe object[' + (typeof target === 'undefined' ? 'undefined' : _typeof(target)) + ']');
	    }
	    this.expression = expression;
	    this.handlers = [];
	    this.path = path || _.parseExpr(expression);
	    this.observers = [];
	    this.observeHandlers = this._initObserveHandlers();
	    this.target = this._observe(target, 0);
	    this._onTargetProxy = _.bind.call(this._onTargetProxy, this);
	    proxy.on(target, this._onTargetProxy);
	  }
	
	  Expression.prototype._onTargetProxy = function _onTargetProxy(obj, proxy) {
	    this.target = proxy;
	  };
	
	  Expression.prototype._observe = function _observe(obj, idx) {
	    var attr = this.path[idx];
	
	    if (idx + 1 < this.path.length) {
	      if (obj[attr]) obj[attr] = this._observe(obj[attr], idx + 1);
	    }
	    return observer.on(obj, attr, this.observeHandlers[idx]);
	  };
	
	  Expression.prototype._unobserve = function _unobserve(obj, idx) {
	    var attr = this.path[idx];
	
	    obj = observer.un(obj, attr, this.observeHandlers[idx]);
	    if (idx + 1 < this.path.length) obj[attr] = this._unobserve(obj[attr], idx + 1);
	    return obj;
	  };
	
	  Expression.prototype._initObserveHandlers = function _initObserveHandlers() {
	    var handlers = [];
	
	    for (var i = 0, l = this.path.length; i < l; i++) {
	      handlers.push(this._createObserveHandler(i));
	    }
	    return handlers;
	  };
	
	  Expression.prototype._createObserveHandler = function _createObserveHandler(idx) {
	    var _this = this;
	
	    var path = this.path.slice(0, idx + 1),
	        rpath = this.path.slice(idx + 1),
	        ridx = this.path.length - idx - 1;
	
	    return function (attr, val, oldVal) {
	      if (ridx) {
	        _this._unobserve(oldVal, idx + 1);
	        _this._observe(val, idx + 1);
	        oldVal = _.get(oldVal, rpath);
	        val = _.get(val, rpath);
	        if (proxy.eq(val, oldVal)) return;
	      }
	
	      var hs = _this.handlers.slice();
	
	      for (var i = 0, l = hs.length; i < l; i++) {
	        hs[i](_this.expression, val, oldVal, _this.target);
	      }
	    };
	  };
	
	  Expression.prototype.on = function on(handler) {
	    if (typeof handler != 'function') {
	      throw TypeError('Invalid Observe Handler');
	    }
	    this.handlers.push(handler);
	    return this;
	  };
	
	  Expression.prototype.un = function un(handler) {
	    if (!arguments.length) {
	      this.handlers = [];
	    } else {
	      if (typeof handler != 'function') {
	        throw TypeError('Invalid Observe Handler');
	      }
	
	      var handlers = this.handlers;
	
	      for (var i = handlers.length - 1; i >= 0; i--) {
	        if (handlers[i] === handler) {
	          handlers.splice(i, 1);
	          break;
	        }
	      }
	    }
	    return this;
	  };
	
	  Expression.prototype.hasListen = function hasListen(handler) {
	    if (arguments.length) return _.indexOf.call(this.handlers, handler) != -1;
	    return !!this.handlers.length;
	  };
	
	  Expression.prototype.destory = function destory() {
	    proxy.un(this.target, this._onTargetProxy);
	    var obj = this._unobserve(this.target, 0);
	    this.target = undefined;
	    this.expression = undefined;
	    this.handlers = undefined;
	    this.path = undefined;
	    this.observers = undefined;
	    this.observeHandlers = undefined;
	    this.target = undefined;
	    return obj;
	  };
	
	  return Expression;
	}();
	
	module.exports = Expression;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Observer = __webpack_require__(6);
	var Map = __webpack_require__(2);
	
	var _require = __webpack_require__(1);
	
	var proxy = _require.proxy;
	
	
	var observers = new Map();
	var factory = {
	  _bind: function _bind(obj, observer) {
	    observers.set(obj, observer);
	  },
	  _unbind: function _unbind(obj, observer) {
	    if (observers.get(obj) === observer) {
	      observers['delete'](obj);
	    }
	  },
	  _get: function _get(obj) {
	    return observers.get(obj);
	  },
	  hasListen: function hasListen(obj, attr, handler) {
	    var observer = undefined,
	        l = arguments.length;
	
	    obj = proxy.obj(obj);
	    observer = observers.get(obj);
	    if (!observer) {
	      return false;
	    } else if (l == 1) {
	      return true;
	    } else if (l == 2) {
	      return observer.hasListen(obj, attr);
	    }
	    return observer.hasListen(obj, attr, handler);
	  },
	  on: function on(obj, attr, handler) {
	    var observer = undefined;
	
	    obj = proxy.obj(obj);
	    observer = observers.get(obj);
	    if (!observer) {
	      observer = new Observer(obj);
	      factory._bind(obj, observer);
	    }
	    return observer.on(attr, handler);
	  },
	  un: function un(obj, attr, handler) {
	    var observer = undefined;
	
	    obj = proxy.obj(obj);
	    observer = observers.get(obj);
	    if (observer) {
	      obj = arguments.length > 2 ? observer.un(attr, handler) : observer.un(attr);
	      if (!observer.hasListen()) {
	        factory._unbind(obj, observer);
	        observer.destroy();
	      }
	    }
	    return obj;
	  }
	};
	module.exports = factory;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var _require = __webpack_require__(7);
	
	var VBProxyFactory = _require.VBProxyFactory;
	
	var _require2 = __webpack_require__(1);
	
	var proxy = _require2.proxy;
	var proxyChange = _require2.proxyChange;
	var proxyEnable = _require2.proxyEnable;
	var proxyDisable = _require2.proxyDisable;
	var _ = __webpack_require__(3);
	
	var arrayHockMethods = ['push', 'pop', 'shift', 'unshift', 'sort', 'reverse', 'splice'];
	var config = {
	  lazy: true,
	  animationFrame: true,
	  chromeObserve: true,
	  es6Proxy: true
	};
	
	var Observer = function () {
	  function Observer(target) {
	    _classCallCheck(this, Observer);
	
	    if (target instanceof Array) {
	      this.isArray = true;
	    } else if (target && (typeof target === 'undefined' ? 'undefined' : _typeof(target)) == 'object') {
	      this.isArray = false;
	    } else {
	      throw TypeError('can not observe object[' + (typeof target === 'undefined' ? 'undefined' : _typeof(target)) + ']');
	    }
	    this.target = target;
	    this.obj = target;
	    this.listens = {};
	    this.changeRecords = {};
	    this._notify = _.bind.call(this._notify, this);
	    this.watchPropNum = 0;
	    this._init();
	  }
	
	  Observer.prototype._fire = function _fire(attr, val, oldVal) {
	    if (proxy.eq(val, oldVal)) return;
	    var handlers = this.listens[attr].slice();
	
	    for (var i = 0, l = handlers.length; i < l; i++) {
	      handlers[i](attr, val, oldVal, this.target);
	    }
	  };
	
	  Observer.prototype._notify = function _notify() {
	    var changeRecords = this.changeRecords;
	    for (var attr in changeRecords) {
	      this._fire(attr, this.obj[attr], changeRecords[attr]);
	    }
	    this.request_frame = undefined;
	    this.changeRecords = {};
	  };
	
	  Observer.prototype._addChangeRecord = function _addChangeRecord(attr, oldVal) {
	    if (!config.lazy) {
	      this._fire(attr, this.obj[attr], oldVal);
	    } else if (!(attr in this.changeRecords)) {
	      this.changeRecords[attr] = oldVal;
	      if (!this.request_frame) this.request_frame = (config.animationFrame ? _.requestAnimationFrame : _.requestTimeoutFrame)(this._notify);
	    }
	  };
	
	  Observer.prototype.hasListen = function hasListen(attr, handler) {
	    var l = arguments.length,
	        listens = this.listens;
	    if (!l) {
	      return !!this.watchPropNum;
	    } else if (l == 1) {
	      if (typeof attr == 'function') {
	        var handlers = undefined;
	        for (var k in listens) {
	          handlers = listens[k];
	          if (handlers && _.indexOf.call(handlers, attr) != -1) return true;
	        }
	        return false;
	      } else return !!listens[attr];
	    } else {
	      if (typeof handler != 'function') {
	        throw TypeError('Invalid Observe Handler');
	      }
	      var handlers = listens[attr];
	      return handlers && _.indexOf.call(handlers, handler) != -1;
	    }
	  };
	
	  Observer.prototype.on = function on(attr, handler) {
	    if (typeof handler != 'function') {
	      throw TypeError('Invalid Observe Handler');
	    }
	
	    var handlers = this.listens[attr];
	
	    if (!handlers) {
	      this.listens[attr] = [handler];
	      this.watchPropNum++;
	      this._watch(attr);
	    } else handlers.push(handler);
	    return this.target;
	  };
	
	  Observer.prototype._cleanListen = function _cleanListen(attr) {
	    this.listens[attr] = undefined;
	    this.watchPropNum--;
	    this._unwatch(attr);
	  };
	
	  Observer.prototype.un = function un(attr, handler) {
	    var handlers = this.listens[attr];
	    if (handlers) {
	      if (arguments.length == 1) {
	        this._cleanListen(attr);
	      } else {
	        if (typeof handler != 'function') throw TypeError('Invalid Observe Handler');
	
	        for (var i = handlers.length - 1; i >= 0; i--) {
	          if (handlers[i] === handler) {
	            handlers.splice(i, 1);
	            if (!handlers.length) this._cleanListen(attr);
	            break;
	          }
	        }
	      }
	    }
	    return this.target;
	  };
	
	  Observer.prototype.destroy = function destroy() {
	    if (this.request_frame) {
	      (config.animationFrame ? _.cancelAnimationFrame : _.cancelTimeoutFrame)(this.request_frame);
	      this.request_frame = undefined;
	    }
	    this._destroy();
	    this.obj = undefined;
	    this.target = undefined;
	    this.listens = undefined;
	    this.changeRecords = undefined;
	  };
	
	  return Observer;
	}();
	
	function applyProto(name, fn) {
	  Observer.prototype[name] = fn;
	  return fn;
	}
	
	function chromeObserve() {
	  Observer.policy = 'chromeObserve';
	  proxyDisable();
	
	  applyProto('_init', function _init() {
	    this._onObserveChanged = _.bind.call(this._onObserveChanged, this);
	    this.chromeObserve = false;
	  });
	
	  applyProto('_destroy', function _destroy() {
	    if (this.chromeObserve) {
	      Object.unobserve(this.target, this._onObserveChanged);
	      this.chromeObserve = false;
	    }
	  });
	
	  applyProto('_onObserveChanged', function _onObserveChanged(changes) {
	    var c = undefined;
	    for (var i = 0, l = changes.length; i < l; i++) {
	      c = changes[i];
	      if (this.listens[c.name]) this._addChangeRecord(c.name, c.oldValue);
	    }
	  });
	
	  applyProto('_watch', function _watch(attr) {
	    if (!this.chromeObserve) {
	      Object.observe(this.target, this._onObserveChanged);
	      this.chromeObserve = true;
	    }
	  });
	
	  applyProto('_unwatch', function _unwatch(attr) {
	    if (this.chromeObserve && !this.hasListen()) {
	      Object.unobserve(this.target, this._onObserveChanged);
	      this.chromeObserve = false;
	    }
	  });
	}
	
	function es6Proxy() {
	  Observer.policy = 'es6Proxy';
	
	  var objProxyLoop = new Map(),
	      proxyObjLoop = new Map();
	
	  proxyEnable();
	
	  proxy.obj = function (proxy) {
	    return proxyObjLoop.get(proxy) || proxy;
	  };
	
	  proxy.eq = function (obj1, obj2) {
	    return proxy.obj(obj1) === proxy.obj(obj2);
	  };
	
	  proxy.proxy = function (obj) {
	    return objProxyLoop.get(obj);
	  };
	
	  applyProto('_init', function _init() {
	    this.obj = proxy.obj(this.target);
	    this.es6proxy = false;
	  });
	
	  applyProto('_destroy', function _destroy() {
	    if (this.es6proxy) {
	      proxyChange(this.obj, undefined);
	      proxyObjLoop['delete'](this.target);
	      objProxyLoop['delete'](this.obj);
	      this.es6proxy = false;
	    }
	  });
	
	  applyProto('_createArrayProxy', function _arrayProxy() {
	    var _this = this;
	
	    var oldLength = this.target.length;
	    return new Proxy(this.obj, {
	      set: function set(obj, prop, value) {
	        if (!_this.listens[prop]) {
	          obj[prop] = value;
	          return true;
	        }
	        var oldVal = undefined;
	        if (prop === 'length') {
	          oldVal = oldLength;
	          oldLength = value;
	        } else {
	          oldVal = obj[prop];
	        }
	        obj[prop] = value;
	        if (value !== oldVal) _this._addChangeRecord(prop, oldVal);
	        return true;
	      }
	    });
	  });
	
	  applyProto('_createObjectProxy', function _arrayProxy() {
	    var _this2 = this;
	
	    return new Proxy(this.obj, {
	      set: function set(obj, prop, value) {
	        if (!_this2.listens[prop]) {
	          obj[prop] = value;
	          return true;
	        }
	        var oldVal = obj[prop];
	        obj[prop] = value;
	        if (value !== oldVal) _this2._addChangeRecord(prop, oldVal);
	        return true;
	      }
	    });
	  });
	
	  applyProto('_watch', function _watch(attr) {
	    if (!this.es6proxy) {
	      var _proxy = this.isArray ? this._createArrayProxy() : this._createObjectProxy();
	
	      this.target = _proxy;
	      proxyObjLoop.set(_proxy, this.obj);
	      objProxyLoop.set(this.obj, _proxy);
	      proxyChange(this.obj, _proxy);
	      this.es6proxy = true;
	    }
	  });
	
	  applyProto('_unwatch', function _unwatch(attr) {
	    if (this.es6proxy && !this.hasListen()) {
	      proxyChange(this.obj, undefined);
	      proxyObjLoop['delete'](this.target);
	      objProxyLoop['delete'](this.obj);
	      this.target = this.obj;
	      this.es6proxy = false;
	    }
	  });
	}
	
	function es5DefineProperty() {
	  var init = applyProto('_init', function _init() {
	    this.watchers = {};
	  });
	
	  var destroy = applyProto('_destroy', function _destroy() {
	    for (var attr in this.watchers) {
	      if (this.watchers[attr]) this._unwatch(attr);
	    }
	    this.watchers = undefined;
	  });
	
	  applyProto('_hockArrayLength', function _hockArrayLength(method) {
	    var self = this;
	
	    this.obj[method] = function () {
	      var len = this.length;
	
	      Array.prototype[method].apply(this, arguments);
	      if (self.obj.length != len) self._addChangeRecord('length', len);
	    };
	  });
	
	  applyProto('_watch', function _watch(attr) {
	    if (!this.watchers[attr]) {
	      if (this.isArray && attr === 'length') {
	        for (var i = 0, l = arrayHockMethods.length; i < l; i++) {
	          this._hockArrayLength(arrayHockMethods[i]);
	        }
	      } else {
	        this._defineProperty(attr, this.obj[attr]);
	      }
	      this.watchers[attr] = true;
	    }
	  });
	
	  applyProto('_unwatch', function _unwatch(attr) {
	    if (this.watchers[attr]) {
	      if (this.isArray && attr === 'length') {
	        for (var i = 0, l = arrayHockMethods.length; i < l; i++) {
	          delete this.obj[arrayHockMethods[i]];
	        }
	      } else {
	        this._undefineProperty(attr, this.obj[attr]);
	      }
	      this.watchers[attr] = false;
	    }
	  });
	
	  function doesDefinePropertyWork(defineProperty, object) {
	    try {
	      var _ret = function () {
	        var val = undefined;
	        defineProperty(object, 'sentinel', {
	          get: function get() {
	            return val;
	          },
	          set: function set(value) {
	            val = value;
	          }
	        });
	        object.sentinel = 1;
	        return {
	          v: object.sentinel === val
	        };
	      }();
	
	      if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
	    } catch (exception) {
	      return false;
	    }
	  }
	
	  if (Object.defineProperty && doesDefinePropertyWork(Object.defineProperty, {})) {
	    Observer.policy = 'es5DefineProperty';
	    proxyDisable();
	    applyProto('_defineProperty', function _defineProperty(attr, value) {
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
	    });
	
	    applyProto('_undefineProperty', function _undefineProperty(attr, value) {
	      Object.defineProperty(this.target, attr, {
	        enumerable: true,
	        configurable: true,
	        writable: true,
	        value: value
	      });
	    });
	  } else if ('__defineGetter__' in {}) {
	    Observer.policy = 'defineGetterAndSetter';
	    proxyDisable();
	    applyProto('_defineProperty', function _defineProperty(attr, value) {
	      var _this4 = this;
	
	      this.target.__defineGetter__(attr, function () {
	        return value;
	      });
	      this.target.__defineSetter__(attr, function (val) {
	        var oldVal = value;
	        value = val;
	        _this4._addChangeRecord(attr, oldVal);
	      });
	    });
	
	    applyProto('_undefineProperty', function _undefineProperty(attr, value) {
	      this.target.__defineGetter__(attr, function () {
	        return value;
	      });
	      this.target.__defineSetter__(attr, function (val) {
	        value = val;
	      });
	    });
	  } else if (VBProxyFactory.isSupport()) {
	    (function () {
	      Observer.policy = 'VBProxy';
	      proxyEnable();
	
	      var factory = Observer.VBProxyFactory = new VBProxyFactory(proxyChange);
	      proxy.obj = factory.obj;
	      proxy.eq = factory.eq;
	      proxy.proxy = factory.getVBProxy;
	
	      applyProto('_init', function _init() {
	        init();
	        this.obj = factory.obj(this.target);
	      });
	
	      applyProto('_destroy', function _destroy() {
	        destroy();
	      });
	
	      applyProto('_defineProperty', function _defineProperty(attr, value) {
	        var _this5 = this;
	
	        var obj = this.obj,
	            desc = factory.getVBProxyDesc(obj);
	
	        if (!desc) desc = factory.getVBProxyDesc(factory.createVBProxy(obj));
	        this.target = desc.defineProperty(attr, {
	          get: function get() {
	            return value;
	          },
	          set: function set(val) {
	            var oldVal = value;
	            value = val;
	            _this5._addChangeRecord(attr, oldVal);
	          }
	        });
	      });
	
	      applyProto('_undefineProperty', function _undefineProperty(attr, value) {
	        var obj = this.obj,
	            desc = factory.getVBProxyDesc(obj);
	
	        if (desc) {
	          this.target = desc.defineProperty(attr, {
	            value: value
	          });
	          if (!desc.hasAccessor()) {
	            this.target = factory.freeVBProxy(obj);
	          }
	        }
	      });
	    })();
	  } else {
	    throw new Error('Not Supported.');
	  }
	}
	
	function applyPolicy() {
	  if (Object.observe && config.chromeObserve && Observer.policy != 'chromeObserve') {
	    chromeObserve();
	  } else if (window.Proxy && config.es6Proxy && Observer.policy != 'es6Proxy') {
	    es6Proxy();
	  } else if (!Observer.policy) {
	    es5DefineProperty();
	  }
	}
	
	Observer.setConfig = function setConfig(cfg) {
	  var oldCfg = {};
	  for (var attr in cfg) {
	    if (attr in config) {
	      oldCfg[attr] = config[attr];
	      config[attr] = cfg[attr];
	    }
	  }
	  if (cfg.chromeObserve != oldCfg.chromeObserve || cfg.es6Proxy != oldCfg.es6Proxy) {
	    applyPolicy();
	  }
	  return cfg;
	};
	
	Observer.config = config;
	
	applyPolicy();
	
	module.exports = Observer;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports.VBProxyFactory = VBProxyFactory;
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Map = __webpack_require__(2);
	
	function VBProxyFactory(onProxyChange) {
	  var OBJECT_PROTO_PROPS = [Map.HASH_BIND, 'hasOwnProperty', 'toString', 'toLocaleString', 'isPrototypeOf', 'propertyIsEnumerable', 'valueOf'],
	      ARRAY_PROTO_PROPS = OBJECT_PROTO_PROPS.concat(['concat', 'copyWithin', 'entries', 'every', 'fill', 'filter', 'find', 'findIndex', 'forEach', 'indexOf', 'lastIndexOf', 'length', 'map', 'keys', 'join', 'pop', 'push', 'reverse', 'reverseRight', 'some', 'shift', 'slice', 'sort', 'splice', 'toSource', 'unshift']),
	      OBJECT_PROTO_PROPS_MAP = {},
	      ARRAY_PROTO_PROPS_MAP = {},
	      DESC_BINDING = '__VB_PROXY__',
	      CONST_BINDING = '__VB_CONST__',
	      CONST_SCRIPT = ['\tPublic [', DESC_BINDING, ']\r\n', '\tPublic Default Function [', CONST_BINDING, '](desc)\r\n', '\t\tset [', DESC_BINDING, '] = desc\r\n', '\t\tSet [', CONST_BINDING, '] = Me\r\n', '\tEnd Function\r\n'].join(''),
	      VBClassPool = {},
	      ClassNameGenerator = 0,
	      hasOwnProperty = Object.prototype.hasOwnProperty;
	
	  for (var i = OBJECT_PROTO_PROPS.length - 1; i >= 0; i--) {
	    OBJECT_PROTO_PROPS_MAP[OBJECT_PROTO_PROPS[i]] = true;
	  }
	  for (var i = ARRAY_PROTO_PROPS.length - 1; i >= 0; i--) {
	    ARRAY_PROTO_PROPS_MAP[ARRAY_PROTO_PROPS[i]] = true;
	  }
	
	  function generateVBClassName() {
	    return 'VBClass' + ClassNameGenerator++;
	  }
	
	  function parseVBClassConstructorName(className) {
	    return className + 'Constructor';
	  }
	
	  function generateSetter(attr) {
	    return ['\tPublic Property Get [', attr, ']\r\n', '\tOn Error Resume Next\r\n', '\t\tSet[', attr, '] = [', DESC_BINDING, '].get("', attr, '")\r\n', '\tIf Err.Number <> 0 Then\r\n', '\t\t[', attr, '] = [', DESC_BINDING, '].get("', attr, '")\r\n', '\tEnd If\r\n', '\tOn Error Goto 0\r\n', '\tEnd Property\r\n'];
	  }
	
	  function generateGetter(attr) {
	    return ['\tPublic Property Let [', attr, '](val)\r\n', '\t\tCall [', DESC_BINDING, '].set("', attr, '",val)\r\n', '\tEnd Property\r\n', '\tPublic Property Set [', attr, '](val)\r\n', '\t\tCall [', DESC_BINDING, '].set("', attr, '",val)\r\n', '\tEnd Property\r\n'];
	  }
	
	  function generateVBClass(VBClassName, properties) {
	    var buffer = undefined,
	        i = undefined,
	        l = undefined,
	        attr = undefined,
	        added = {};
	
	    buffer = ['Class ', VBClassName, '\r\n', CONST_SCRIPT, '\r\n'];
	    for (i = 0, l = properties.length; i < l; i++) {
	      attr = properties[i];
	      buffer.push.apply(buffer, generateSetter(attr));
	      buffer.push.apply(buffer, generateGetter(attr));
	      added[attr] = true;
	    }
	    buffer.push('End Class\r\n');
	    return buffer.join('');
	  }
	
	  function generateVBClassConstructor(properties) {
	    var key = [properties.length, '[', properties.join(','), ']'].join(''),
	        VBClassConstructorName = VBClassPool[key];
	
	    if (VBClassConstructorName) return VBClassConstructorName;
	
	    var VBClassName = generateVBClassName();
	    VBClassConstructorName = parseVBClassConstructorName(VBClassName);
	    parseVB(generateVBClass(VBClassName, properties));
	    parseVB(['Function ', VBClassConstructorName, '(desc)\r\n', '\tDim o\r\n', '\tSet o = (New ', VBClassName, ')(desc)\r\n', '\tSet ', VBClassConstructorName, ' = o\r\n', 'End Function'].join(''));
	    VBClassPool[key] = VBClassConstructorName;
	    return VBClassConstructorName;
	  }
	
	  function _createVBProxy(object, desc) {
	    var isArray = object instanceof Array,
	        props = undefined,
	        proxy = undefined;
	
	    if (isArray) {
	      props = ARRAY_PROTO_PROPS.slice();
	      for (var attr in object) {
	        if (attr !== DESC_BINDING) if (!(attr in ARRAY_PROTO_PROPS_MAP)) props.push(attr);
	      }
	    } else {
	      props = OBJECT_PROTO_PROPS.slice();
	      for (var attr in object) {
	        if (attr !== DESC_BINDING) if (!(attr in OBJECT_PROTO_PROPS_MAP)) props.push(attr);
	      }
	    }
	    desc = desc || new ObjectDescriptor(object, props);
	    proxy = window[generateVBClassConstructor(props)](desc);
	    desc.proxy = proxy;
	    onProxyChange(object, proxy);
	    return proxy;
	  }
	
	  var ObjectDescriptor = function () {
	    function ObjectDescriptor(object, props) {
	      _classCallCheck(this, ObjectDescriptor);
	
	      var defines = {};
	      for (var i = 0, l = props.length; i < l; i++) {
	        defines[i] = false;
	      }
	      this.object = object;
	      this.defines = defines;
	      object[DESC_BINDING] = this;
	      this.accessorNR = 0;
	    }
	
	    ObjectDescriptor.prototype.isAccessor = function isAccessor(desc) {
	      return desc && (desc.get || desc.set);
	    };
	
	    ObjectDescriptor.prototype.hasAccessor = function hasAccessor() {
	      return !!this.accessorNR;
	    };
	
	    ObjectDescriptor.prototype.defineProperty = function defineProperty(attr, desc) {
	      if (!(attr in this.defines)) {
	        if (!(attr in this.object)) this.object[attr] = undefined;
	        _createVBProxy(this.object, this);
	      }
	      if (!this.isAccessor(desc)) {
	        if (this.defines[attr]) {
	          this.defines[attr] = false;
	          this.accessorNR--;
	        }
	        this.object[attr] = desc.value;
	      } else {
	        this.accessorNR++;
	        this.defines[attr] = desc;
	        if (desc.get) this.object[attr] = desc.get();
	      }
	      return this.proxy;
	    };
	
	    ObjectDescriptor.prototype.getPropertyDefine = function getPropertyDefine(attr) {
	      return this.defines[attr] || undefined;
	    };
	
	    ObjectDescriptor.prototype.get = function get(attr) {
	      var define = this.defines[attr];
	      if (define && define.get) {
	        return define.get.call(this.proxy);
	      } else {
	        return this.object[attr];
	      }
	    };
	
	    ObjectDescriptor.prototype.set = function set(attr, value) {
	      var define = this.defines[attr];
	      if (define && define.set) {
	        define.set.call(this.proxy, value);
	      }
	      this.object[attr] = value;
	    };
	
	    ObjectDescriptor.prototype.destroy = function destroy() {
	      this.defines = {};
	    };
	
	    return ObjectDescriptor;
	  }();
	
	  var api = {
	    eq: function eq(obj1, obj2) {
	      var desc1 = obj1[DESC_BINDING],
	          desc2 = obj2[DESC_BINDING];
	      if (desc1) obj1 = desc1.object;
	      if (desc2) obj2 = desc2.object;
	      return obj1 === obj2;
	    },
	    obj: function obj(object) {
	      var desc = object[DESC_BINDING];
	      return desc ? desc.object : object;
	    },
	    isVBProxy: function isVBProxy(object) {
	      return CONST_BINDING in object;
	    },
	    getVBProxy: function getVBProxy(object) {
	      var desc = object[DESC_BINDING];
	      return desc ? desc.proxy : undefined;
	    },
	    getVBProxyDesc: function getVBProxyDesc(object) {
	      return object[DESC_BINDING];
	    },
	    createVBProxy: function createVBProxy(object) {
	      var desc = object[DESC_BINDING];
	
	      if (desc) {
	        object = desc.object;
	      }
	      return _createVBProxy(object, desc);
	    },
	    freeVBProxy: function freeVBProxy(object) {
	      var desc = object[DESC_BINDING];
	      if (desc) {
	        object = desc.object;
	        desc.destroy();
	        object[DESC_BINDING] = undefined;
	        onProxyChange(object, undefined);
	      }
	      return object;
	    }
	  };
	  return api;
	}
	
	var supported = undefined;
	VBProxyFactory.isSupport = function isSupport() {
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

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Exp = __webpack_require__(4);
	var observer = __webpack_require__(5);
	var Map = __webpack_require__(2);
	
	var _require = __webpack_require__(1);
	
	var proxy = _require.proxy;
	var _ = __webpack_require__(3);
	
	var exps = new Map();
	var factory = {
	  _bind: function _bind(obj, exp) {
	    var desc = exps.get(obj);
	
	    if (!desc) {
	      exps.set(obj, desc = {
	        exprNum: 1,
	        map: {}
	      });
	    } else desc.exprNum++;
	    desc.map[exp.expression] = exp;
	  },
	  _unbind: function _unbind(obj, exp) {
	    var desc = exps.get(obj);
	
	    if (desc) {
	      var map = desc.map,
	          expression = exp.expression;
	
	      if (map[expression] === exp) {
	        map[expression] = undefined;
	        if (! --desc.exprNum) exps['delete'](obj);
	      }
	    }
	  },
	  _get: function _get(obj, expression) {
	    var desc = exps.get(obj);
	
	    return desc ? desc.map[expression] : undefined;
	  },
	  on: function on(obj, expression, handler) {
	    var path = _.parseExpr(expression);
	
	    if (path.length > 1) {
	      var exp = undefined;
	
	      obj = proxy.obj(obj);
	      exp = factory._get(obj, expression);
	      if (!exp) {
	        exp = new Exp(obj, expression, path);
	        factory._bind(obj, exp);
	      }
	      exp.on(handler);
	      return exp.target;
	    } else {
	      return observer.on(obj, expression, handler);
	    }
	  },
	  un: function un(obj, expression, handler) {
	    var path = _.parseExpr(expression);
	
	    if (path.length > 1) {
	      var exp = undefined;
	
	      obj = proxy.obj(obj);
	      exp = factory._get(obj, expression);
	      if (exp) {
	        if (arguments.length > 2) exp.un(handler);else exp.un();
	
	        if (!exp.hasListen()) {
	          factory._unbind(obj, exp);
	          return exp.destory();
	        }
	        return exp.target;
	      } else {
	        var ob = observer._get(obj);
	
	        return ob ? ob.target : obj;
	      }
	    } else {
	      return observer.un(obj, expression, handler);
	    }
	  },
	  hasListen: function hasListen(obj, expression, handler) {
	    var l = arguments.length;
	    if (l == 1) {
	      return observer.hasListen(obj);
	    } else if (l == 2) {
	      if (typeof expression == 'function') {
	        return observer.hasListen(obj, expression);
	      }
	    }
	    var path = _.parseExpr(expression);
	    if (path.length > 1) {
	      var exp = factory._get(proxy.obj(obj), expression);
	      if (exp) return l == 2 ? true : exp.hasListen(handler);
	      return false;
	    } else if (l == 2) {
	      return observer.hasListen(obj, expression);
	    } else {
	      return observer.hasListen(obj, expression, handler);
	    }
	  }
	};
	module.exports = factory;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=observer.js.map