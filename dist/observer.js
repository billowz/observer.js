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
	
	window.observer = {
	  on: exp.on,
	  un: exp.un,
	  hasListen: exp.hasListen,
	  obj: proxy.obj,
	  eq: proxy.eq,
	  proxy: proxy,
	  getVal: Exp.get
	};
	module.exports = window.observer;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports.proxyEnable = proxyEnable;
	exports.proxyChange = proxyChange;
	var Map = __webpack_require__(2),
	    _ = __webpack_require__(3);
	
	var proxyEvents = new Map();
	
	var proxy = exports.proxy = {
	  eq: function eq(obj1, obj2) {
	    return obj1 === obj2;
	  },
	  obj: function obj(_obj) {
	    return _obj;
	  },
	  proxy: function proxy(obj) {
	    return obj;
	  },
	  on: function on() {},
	  un: function un() {},
	  _on: function _on(obj, handler) {
	    var handlers = void 0;
	
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
	  },
	  _un: function _un(obj, handler) {
	    var handlers = void 0;
	
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
	};
	
	function proxyEnable() {
	  proxy.on = proxy._on;
	  proxy.un = proxy._un;
	}
	
	function proxyChange(obj, proxy) {
	  handlers = proxyEvents.get(obj);
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

	"use strict";
	
	var lastTime = void 0,
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
	
	if (requestAnimationFrame && cancelAnimationFrame) {
	  requestAnimationFrame = bind.call(requestAnimationFrame, window);
	  cancelAnimationFrame = bind.call(cancelAnimationFrame, window);
	} else {
	  requestAnimationFrame = function requestTimeoutFrame(callback) {
	    var currTime = new Date().getTime(),
	        timeToCall = Math.max(0, 16 - (currTime - lastTime)),
	        reqId = setTimeout(function () {
	      callback(currTime + timeToCall);
	    }, timeToCall);
	    lastTime = currTime + timeToCall;
	    return reqId;
	  };
	  cancelAnimationFrame = function cancelAnimationFrame(reqId) {
	    clearTimeout(reqId);
	  };
	}
	
	var util = {
	  requestAnimationFrame: requestAnimationFrame,
	
	  cancelAnimationFrame: cancelAnimationFrame,
	
	  eachObj: function eachObj(obj, callback) {
	    var hasOwn = Object.prototype.hasOwnProperty;
	    for (var i in obj) {
	      if (hasOwn.call(obj, i)) {
	        if (callback(obj[i], i) === false) return false;
	      }
	    }
	  },
	
	
	  bind: bind,
	
	  indexOf: Array.prototype.indexOf || function indexOf(val) {
	    for (var i = 0, l = this.length; i < l; i++) {
	      if (this[i] === val) {
	        return i;
	      }
	    }
	    return -1;
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
	
	var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
	    reIsPlainProp = /^\w*$/,
	    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;
	
	function baseToString(val) {
	  return val === undefined || val === null ? '' : val + '';
	}
	
	var exprCache = {};
	
	var Expression = function () {
	  Expression._parseExpr = function _parseExpr(exp) {
	    if (exp instanceof Array) {
	      return exp;
	    } else {
	      var _ret = function () {
	        var result = exprCache[exp];
	        if (!result) {
	          result = exprCache[exp] = [];
	          (exp + '').replace(rePropName, function (match, number, quote, string) {
	            result.push(quote ? string.replace(reEscapeChar, '$1') : number || match);
	          });
	        }
	        return {
	          v: result
	        };
	      }();
	
	      if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
	    }
	  };
	
	  Expression.get = function get(object, path, defaultValue) {
	    if (object) {
	      path = Expression._parseExpr(path);
	      var index = 0;
	
	      while (object && index < path.length) {
	        object = object[path[index++]];
	      }
	      return index == path.length ? object : undefined;
	    }
	    return defaultValue;
	  };
	
	  function Expression(target, expression, path) {
	    _classCallCheck(this, Expression);
	
	    if (!target || !(target instanceof Array || (typeof target === 'undefined' ? 'undefined' : _typeof(target)) == 'object')) {
	      throw TypeError('can not observe object[' + (typeof target === 'undefined' ? 'undefined' : _typeof(target)) + ']');
	    }
	    this.expression = expression;
	    this.handlers = [];
	    this.path = path || Expression._parseExpr(expression);
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
	        oldVal = Expression.get(oldVal, rpath);
	        val = Expression.get(val, rpath);
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
	    var observer = void 0,
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
	    var observer = void 0;
	
	    obj = proxy.obj(obj);
	    observer = observers.get(obj);
	    if (!observer) {
	      observer = new Observer(obj);
	      factory._bind(obj, observer);
	    }
	    obj = observer.on(attr, handler);
	    if (!observer.hasListen()) {
	      factory._unbind(obj, observer);
	      observer.destroy();
	    }
	    return obj;
	  },
	  un: function un(obj, attr, handler) {
	    var observer = void 0;
	
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
	var _ = __webpack_require__(3);
	
	var arrayHockMethods = ['push', 'pop', 'shift', 'unshift', 'sort', 'reverse', 'splice'];
	
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
	    this.listens = {};
	    this.changeRecords = {};
	    this._notify = _.bind.call(this._notify, this);
	    this._init();
	  }
	
	  Observer.prototype._fire = function _fire(attr, val, oldVal) {
	    var handlers = this.listens[attr].slice();
	
	    for (var i = 0, l = handlers.length; i < l; i++) {
	      handlers[i](attr, val, oldVal, this.target);
	    }
	  };
	
	  Observer.prototype._notify = function _notify() {
	    var _this = this;
	
	    _.eachObj(this.changeRecords, function (oldVal, attr) {
	      var val = _this.target[attr];
	      if (!proxy.eq(val, oldVal)) {
	        _this._fire(attr, val, oldVal);
	      }
	    });
	    this.request_frame = undefined;
	    this.changeRecords = {};
	  };
	
	  Observer.prototype._addChangeRecord = function _addChangeRecord(attr, oldVal) {
	    if (!Observer.lazy) {
	      this._fire(attr, this.target[attr], oldVal);
	    } else if (!(attr in this.changeRecords)) {
	      this.changeRecords[attr] = oldVal;
	      if (!this.request_frame) this.request_frame = _.requestAnimationFrame(this._notify);
	    }
	  };
	
	  Observer.prototype.hasListen = function hasListen(attr, handler) {
	    var l = arguments.length,
	        listens = this.listens;
	    if (!l) {
	      for (var i in listens) {
	        return true;
	      }return false;
	    } else if (l == 1) {
	      console.log(attr);
	      if (typeof attr == 'function') {
	        for (var k in listens) {
	          if (_.indexOf.call(listens[k], attr) != -1) return true;
	        }
	        return false;
	      } else return !!listens[attr];
	    } else {
	      console.log(attr, handler);
	      if (typeof handler != 'function') {
	        throw TypeError('Invalid Observe Handler');
	      }
	      return listens[attr] && _.indexOf.call(listens[attr], handler) != -1;
	    }
	  };
	
	  Observer.prototype.on = function on(attr, handler) {
	    if (typeof handler != 'function') {
	      throw TypeError('Invalid Observe Handler');
	    }
	
	    var handlers = this.listens[attr];
	
	    if (!handlers) {
	      this.listens[attr] = [handler];
	      this._watch(attr);
	    } else handlers.push(handler);
	    return this.target;
	  };
	
	  Observer.prototype._cleanListen = function _cleanListen(attr) {
	    delete this.listens[attr];
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
	      _.cancelAnimationFrame(this.request_frame);
	      this.request_frame = undefined;
	    }
	    this._destroy();
	    this.target = undefined;
	    this.listens = undefined;
	    this.changeRecords = undefined;
	  };
	
	  return Observer;
	}();
	
	Observer.lazy = false;
	
	function applyProto(name, fn) {
	  Observer.prototype[name] = fn;
	}
	
	function es7Observe() {
	  applyProto('_init', function _init() {
	    this._onObserveChanged = _.bind.call(this._onObserveChanged, this);
	  });
	
	  applyProto('_destroy', function _destroy() {
	    if (this.es7observe) {
	      Object.unobserve(this.target, this._onObserveChanged);
	      this.es7observe = undefined;
	    }
	  });
	
	  applyProto('_onObserveChanged', function _onObserveChanged(changes) {
	    var c = void 0;
	    for (var i = 0, l = changes.length; i < l; i++) {
	      c = changes[i];
	      if (this.listens[c.name]) this._addChangeRecord(c.name, c.oldValue);
	    }
	  });
	
	  applyProto('_watch', function _watch(attr) {
	    if (!this.es7observe) {
	      Object.observe(this.target, this._onObserveChanged);
	      this.es7observe = true;
	    }
	  });
	
	  applyProto('_unwatch', function _unwatch(attr) {
	    if (this.es7observe && !this.hasListen()) {
	      Object.unobserve(this.target, this._onObserveChanged);
	      this.es7observe = false;
	    }
	  });
	}
	
	function es6Proxy() {
	  applyProto('_init', function _init() {
	    this._onObserveChanged = _.bind.call(this._onObserveChanged, this);
	  });
	
	  applyProto('_destroy', function _destroy() {
	    if (this.es7observe) {
	      Object.unobserve(this.target, this._onObserveChanged);
	      this.es7observe = undefined;
	    }
	  });
	
	  applyProto('_onObserveChanged', function _onObserveChanged(changes) {
	    var c = void 0;
	    for (var i = 0, l = changes.length; i < l; i++) {
	      c = changes[i];
	      if (this.listens[c.name]) this._addChangeRecord(c.name, c.oldValue);
	    }
	  });
	
	  applyProto('_watch', function _watch(attr) {
	    if (!this.es7observe) {
	      Object.observe(this.target, this._onObserveChanged);
	      this.es7observe = true;
	    }
	  });
	
	  applyProto('_unwatch', function _unwatch(attr) {
	    if (this.es7observe && !this.hasListen()) {
	      Object.unobserve(this.target, this._onObserveChanged);
	      this.es7observe = false;
	    }
	  });
	}
	
	function es5DefineProperty() {
	  applyProto('_init', function _init() {
	    this.watchers = {};
	  });
	
	  applyProto('_destroy', function _destroy() {
	    for (var attr in this.watchers) {
	      this._unwatch(attr);
	    }
	  });
	
	  applyProto('_hockArrayLength', function _hockArrayLength(method) {
	    var self = this;
	
	    this.target[method] = function () {
	      var len = this.length;
	
	      Array.prototype[method].apply(this, arguments);
	      if (self.target.length != len) self._addChangeRecord('length', len);
	    };
	  });
	
	  applyProto('_watch', function _watch(attr) {
	    if (!this.watchers[attr]) {
	      if (this.isArray && attr === 'length') {
	        for (var i = 0, l = arrayHockMethods.length; i < l; i++) {
	          this._hockArrayLength(arrayHockMethods[i]);
	        }
	      } else {
	        this._defineProperty(attr, this.target[attr]);
	      }
	      this.watchers[attr] = true;
	    }
	  });
	
	  applyProto('_unwatch', function _unwatch(attr) {
	    if (this.watchers[attr]) {
	      if (this.isArray && attr === 'length') {
	        for (var i = 0, l = arrayHockMethods.length; i < l; i++) {
	          delete this.target[arrayHockMethods[i]];
	        }
	      } else {
	        this._undefineProperty(attr, this.target[attr]);
	      }
	      delete this.watchers[attr];
	    }
	  });
	
	  function doesDefinePropertyWork(defineProperty, object) {
	    try {
	      var _ret = function () {
	        var val = void 0;
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
	    applyProto('_defineProperty', function _defineProperty(attr, value) {
	      var _this2 = this;
	
	      this.target = Object.defineProperty(this.target, attr, {
	        enumerable: true,
	        configurable: true,
	        get: function get() {
	          return value;
	        },
	        set: function set(val) {
	          if (value !== val) {
	            var oldVal = value;
	            value = val;
	            _this2._addChangeRecord(attr, oldVal);
	          }
	        }
	      });
	    });
	
	    applyProto('_undefineProperty', function _undefineProperty(attr, value) {
	      this.target = Object.defineProperty(this.target, attr, {
	        enumerable: true,
	        configurable: true,
	        writable: true,
	        value: value
	      });
	    });
	  } else if ('__defineGetter__' in {}) {
	    applyProto('_defineProperty', function _defineProperty(attr, value) {
	      var _this3 = this;
	
	      this.target.__defineGetter__(attr, function () {
	        return value;
	      });
	      this.target.__defineSetter__(attr, function (val) {
	        if (value !== val) {
	          var oldVal = value;
	          value = val;
	          _this3._addChangeRecord(attr, oldVal);
	        }
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
	      var factory = Observer.VBProxyFactory = new VBProxyFactory(proxyChange);
	      proxyEnable();
	      proxy.obj = factory.obj;
	      proxy.eq = factory.eq;
	      proxy.proxy = factory.getVBProxy;
	
	      applyProto('_defineProperty', function _defineProperty(attr, value) {
	        var _this4 = this;
	
	        var obj = factory.obj(this.target),
	            desc = factory.getVBProxyDesc(obj);
	
	        if (!desc) {
	          desc = factory.getVBProxyDesc(factory.createVBProxy(obj));
	        }
	        this.target = desc.defineProperty(attr, {
	          get: function get() {
	            return value;
	          },
	          set: function set(val) {
	            if (value !== val) {
	              var oldVal = value;
	              value = val;
	              _this4._addChangeRecord(attr, oldVal);
	            }
	          }
	        });
	      });
	
	      applyProto('_undefineProperty', function _undefineProperty(attr, value) {
	        var obj = factory.obj(this.target),
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
	
	if (Object.observe) {
	  es7Observe();
	} else if (window.Proxy) {
	  es6Proxy();
	} else {
	  es5DefineProperty();
	}
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
	  for (var _i = ARRAY_PROTO_PROPS.length - 1; _i >= 0; _i--) {
	    ARRAY_PROTO_PROPS_MAP[ARRAY_PROTO_PROPS[_i]] = true;
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
	    var buffer = void 0,
	        i = void 0,
	        l = void 0,
	        attr = void 0,
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
	        props = void 0,
	        proxy = void 0;
	
	    if (isArray) {
	      props = ARRAY_PROTO_PROPS.slice();
	      for (var attr in object) {
	        if (attr !== DESC_BINDING) if (!(attr in ARRAY_PROTO_PROPS_MAP)) props.push(attr);
	      }
	    } else {
	      props = OBJECT_PROTO_PROPS.slice();
	      for (var _attr in object) {
	        if (_attr !== DESC_BINDING) if (!(_attr in OBJECT_PROTO_PROPS_MAP)) props.push(_attr);
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
	      for (var _i2 = 0, l = props.length; _i2 < l; _i2++) {
	        defines[_i2] = false;
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
	    var map = exps.get(obj);
	
	    if (!map) {
	      exps.set(obj, map = {});
	    }
	    map[exp.expression] = exp;
	  },
	  _unbind: function _unbind(obj, exp) {
	    var map = exps.get(obj);
	
	    if (map && map[exp.expression] == exp) {
	      delete map[exp.expression];
	
	      for (var key in map) {
	        return;
	      }
	      exps['delete'](obj);
	    }
	  },
	  _get: function _get(obj, expression) {
	    var map = exps.get(obj);
	
	    return map ? map[expression] : undefined;
	  },
	  on: function on(obj, expression, handler) {
	    var path = Exp._parseExpr(expression);
	
	    if (path.length > 1) {
	      var exp = void 0;
	
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
	    var path = Exp._parseExpr(expression);
	
	    if (path.length > 1) {
	      var exp = void 0;
	
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
	    var path = Exp._parseExpr(expression);
	    if (path.length > 1) {
	      var exp = factory._get(obj, expression);
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