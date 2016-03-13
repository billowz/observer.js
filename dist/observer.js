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
	var exp = __webpack_require__(9);
	var OBJECT = __webpack_require__(7);
	
	window.observer = {
	  on: exp.on,
	  un: exp.un,
	  hasListen: exp.hasListen,
	  obj: proxy.obj,
	  eq: proxy.eq,
	  proxy: proxy,
	  getVal: Exp.get,
	  defineProperty: OBJECT.defineProperty,
	  defineProperties: OBJECT.defineProperties,
	  getOwnPropertyDescriptor: OBJECT.getOwnPropertyDescriptor
	};
	module.exports = window.observer;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports.proxyChange = proxyChange;
	var Map = __webpack_require__(2),
	    _ = __webpack_require__(3);
	
	var proxyEvents = new Map();
	
	var proxy = exports.proxy = {
	  isEnable: function isEnable() {
	    return window.VBProxy;
	  },
	  eq: function eq(obj1, obj2) {
	    if (window.VBProxy) {
	      var desc1 = window.VBProxy.getVBProxyDesc(obj1),
	          desc2 = window.VBProxy.getVBProxyDesc(obj2);
	      if (desc1) obj1 = desc1.object;
	      if (desc2) obj2 = desc2.object;
	    }
	    return obj1 === obj2;
	  },
	  obj: function obj(_obj) {
	    if (window.VBProxy) {
	      var desc = window.VBProxy.getVBProxyDesc(_obj);
	      return desc ? desc.object : _obj;
	    }
	    return _obj;
	  },
	  proxy: function proxy(obj) {
	    if (window.VBProxy) {
	      return window.VBProxy.getVBProxy(obj) || obj;
	    }
	    return obj;
	  },
	  on: function on(obj, handler) {
	    var handlers = undefined;
	
	    if (!window.VBProxy) {
	      return;
	    }
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
	  un: function un(obj, handler) {
	    var handlers = undefined;
	
	    if (!window.VBProxy) {
	      return;
	    }
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
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Map = window.Map;
	
	if (!Map) {
	  (function () {
	    var hash = function hash(value) {
	      return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) + ' ' + (value && ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object' || typeof value == 'function') ? value[HASH_BIND] || (value[HASH_BIND] = ++objHashIdx) : value + '');
	    };
	
	    var ITERATOR_TYPE = {
	      KEY: 'key',
	      VALUE: 'value',
	      ENTRY: 'entry'
	    },
	        HASH_BIND = '__hash__',
	        objHashIdx = 0;
	
	    var _Map = function () {
	      function _Map() {
	        _classCallCheck(this, _Map);
	
	        this._map = {};
	        this._keyMap = {};
	        this._size = 0;
	      }
	
	      _Map.prototype.has = function has(key) {
	        return hash(key) in this._keyMap;
	      };
	
	      _Map.prototype.get = function get(key) {
	        var hcode = hash(key);
	        if (hcode in this._keyMap) {
	          return this._map[hcode];
	        }
	        return undefined;
	      };
	
	      _Map.prototype.set = function set(key, val) {
	        var hcode = hash(key);
	        this._keyMap[hcode] = key;
	        this._map[hcode] = val;
	        if (!(hcode in this._keyMap)) {
	          this._size++;
	        }
	        return this;
	      };
	
	      _Map.prototype['delete'] = function _delete(key) {
	        var hcode = hash(key);
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
	      }
	
	      MapIterator.prototype.next = function next() {
	        if (!this._hashs) {
	          this._hashs = Object.keys(this._map._map);
	        }
	        var val = undefined;
	        if (this._index < this._hashs.length) {
	          var _hash = this._hashs[this.index++];
	          switch (this._type) {
	            case ITERATOR_TYPE.KEY:
	              val = this._map._keyMap[_hash];
	            case ITERATOR_TYPE.VALUE:
	              val = this._map._map[_hash];
	            case ITERATOR_TYPE.ENTRY:
	              val = [this._map._keyMap[_hash], this._map._map[_hash]];
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
	  })();
	}
	module.exports = Map;

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	
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
	    for (var i in obj) {
	      if (obj.hasOwnProperty(i)) {
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
	
	var Expression = function () {
	  Expression._parseExpr = function _parseExpr(exp) {
	    if (exp instanceof Array) {
	      return exp;
	    } else {
	      var _ret = function () {
	        var result = [];
	        (exp + '').replace(rePropName, function (match, number, quote, string) {
	          result.push(quote ? string.replace(reEscapeChar, '$1') : number || match);
	        });
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
	    obj = observer.on(attr, handler);
	    if (!observer.hasListen()) {
	      factory._unbind(obj, observer);
	      observer.destroy();
	    }
	    return obj;
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
	
	var OBJECT = __webpack_require__(7);
	
	var _require = __webpack_require__(1);
	
	var proxy = _require.proxy;
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
	      }
	    } else if (l == 1) {
	      if (typeof attr == 'function') {
	        for (var k in listens) {
	          if (_.indexOf.call(listens[k], attr) != -1) return true;
	        }
	        return false;
	      } else return !!listens[attr];
	    } else {
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
	
	if (Object.observe) {
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
	    var c = undefined;
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
	} else {
	  applyProto('_init', function _init() {
	    this.watchers = {};
	  });
	
	  applyProto('_destroy', function _destroy() {
	    for (var attr in this.watchers) {
	      this._unwatch(attr);
	    }
	  });
	
	  applyProto('_defineProperty', function _defineProperty(attr, value) {
	    var _this2 = this;
	
	    this.target = OBJECT.defineProperty(this.target, attr, {
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
	    this.target = OBJECT.defineProperty(this.target, attr, {
	      enumerable: true,
	      configurable: true,
	      writable: true,
	      value: value
	    });
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
	}
	module.exports = Observer;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	/**
	 * 修复浏览器(IE 6,7,8)对Object.defineProperty的支持，使用VBProxy
	 */
	var _ = __webpack_require__(3);
	
	function doesDefinePropertyWork(OBJECT, object) {
	  try {
	    var _ret = function () {
	      var val = undefined;
	      OBJECT.defineProperty(object, 'sentinel', {
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
	var OBJECT = Object;
	if (!Object.defineProperty || !doesDefinePropertyWork(Object, {})) {
	
	  if ('__defineGetter__' in {}) {
	    OBJECT = {
	      defineProperty: function defineProperty(obj, prop, desc) {
	        if ('value' in desc) {
	          obj[prop] = desc.value;
	        }
	        if ('get' in desc) {
	          obj.__defineGetter__(prop, desc.get);
	        }
	        if ('set' in desc) {
	          obj.__defineSetter__(prop, desc.set);
	        }
	        return obj;
	      },
	      defineProperties: function defineProperties(obj, descs) {
	        _.eachObj(descs, function (desc, prop) {
	          obj = OBJECT.defineProperty(obj, prop, desc);
	        });
	        return obj;
	      },
	      getOwnPropertyDescriptor: function getOwnPropertyDescriptor(object, attr) {
	        var get = object.__lookupGetter__(attr),
	            set = object.__lookupSetter__(attr),
	            desc = {
	          writable: true,
	          enumerable: true,
	          configurable: true
	        };
	        if (get) {
	          desc.get = get;
	          desc.set = set;
	        } else {
	          desc.value = object[attr];
	        }
	        return desc;
	      }
	    };
	  } else {
	    if (__webpack_require__(8)) {
	      OBJECT = {
	        defineProperty: function defineProperty(object, prop, desc) {
	          var proxy = undefined,
	              proxyDesc = undefined,
	              isAccessor = desc.get || desc.set;
	
	          if (VBProxy.isVBProxy(object)) {
	            proxy = object;
	            object = VBProxy.getVBProxyDesc(proxy).object;
	          }
	          if (!proxy && !isAccessor) {
	            object[prop] = desc.value;
	            return object;
	          } else {
	            if (!(prop in object)) object[prop] = undefined;
	            proxy = VBProxy.createVBProxy(proxy || object);
	            proxyDesc = VBProxy.getVBProxyDesc(proxy);
	            proxyDesc.defineProperty(prop, desc);
	            if (!proxyDesc.hasAccessor()) {
	              proxy.__destory__();
	              return object;
	            }
	            return proxy;
	          }
	        },
	        defineProperties: function defineProperties(object, descs) {
	          var proxy = undefined,
	              proxyDesc = undefined,
	              hasAccessor = undefined;
	
	          if (VBProxy.isVBProxy(object)) {
	            proxy = object;
	            object = VBProxy.getVBProxyDesc(proxy).object;
	          }
	          hasAccessor = _.eachObj(descs, function (desc, prop) {
	            return !(desc.get && desc.set);
	          }) === false;
	
	          if (!proxy && !hasAccessor) {
	            _.eachObj(descs, function (desc, prop) {
	              object[prop] = desc.value;
	            });
	            return object;
	          } else {
	            // fill non-props
	            _.eachObj(descs, function (desc, prop) {
	              if (!(prop in object)) object[prop] = undefined;
	            });
	            proxy = VBProxy.createVBProxy(proxy || object);
	            proxyDesc = VBProxy.getVBProxyDesc(proxy);
	            _.eachObj(descs, function (desc, prop) {
	              proxyDesc.defineProperty(prop, desc);
	            });
	            if (!proxyDesc.hasAccessor()) {
	              proxy.__destory__();
	              return object;
	            }
	            return proxy;
	          }
	        },
	        getOwnPropertyDescriptor: function getOwnPropertyDescriptor(object, attr) {
	          var proxy = undefined,
	              define = undefined;
	          if (VBProxy.isSupport()) {
	            proxy = VBProxy.getVBProxy(object);
	            if (proxy) {
	              if (!proxy.hasOwnProperty(attr)) {
	                return undefined;
	              }
	              object = proxy.__proxy__.object;
	              define = proxy.__proxy__.getPropertyDefine(attr);
	            }
	          }
	          return define || {
	            value: object[attr],
	            writable: true,
	            enumerable: true,
	            configurable: true
	          };
	        }
	      };
	    }
	  }
	}
	module.exports = OBJECT;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * 使用VBScript对象代理js对象的get/set方法, 参考Avalon实现
	 * @see  https://github.com/RubyLouvre/avalon/blob/master/src/08%20modelFactory.shim.js
	 */
	var _ = __webpack_require__(3);
	
	var _require = __webpack_require__(1);
	
	var proxyChange = _require.proxyChange;
	
	
	function isSupported() {
	  var support = false;
	  if (window.VBArray) {
	    try {
	      window.execScript([// jshint ignore:line
	      'Function parseVB(code)', '\tExecuteGlobal(code)', 'End Function' //转换一段文本为VB代码
	      ].join('\n'), 'VBScript');
	      support = true;
	    } catch (e) {
	      console.error(e.message, e);
	    }
	  }
	  return support;
	}
	
	if (isSupported()) {
	  (function () {
	    var genClassName = function genClassName() {
	      return 'VBClass' + classId++;
	    };
	
	    var parseVBClassFactoryName = function parseVBClassFactoryName(className) {
	      return className + 'Factory';
	    };
	
	    var genVBClassPropertyGetterScript = function genVBClassPropertyGetterScript(name) {
	      return ['\tPublic Property Get [', name, ']\r\n', '\tOn Error Resume Next\r\n', //必须优先使用set语句,否则它会误将数组当字符串返回
	      '\t\tSet[', name, '] = [', DESC_BINDING, '].get(Me, "', name, '")\r\n', '\tIf Err.Number <> 0 Then\r\n', '\t\t[', name, '] = [', DESC_BINDING, '].get(Me, "', name, '")\r\n', '\tEnd If\r\n', '\tOn Error Goto 0\r\n', '\tEnd Property\r\n'];
	    };
	
	    var genVBClassPropertySetterScript = function genVBClassPropertySetterScript(name) {
	      return ['\tPublic Property Let [', name, '](val)\r\n', '\t\tCall [', DESC_BINDING, '].set(Me, "', name, '",val)\r\n', '\tEnd Property\r\n', '\tPublic Property Set [', name, '](val)\r\n', //setter
	      '\t\tCall [', DESC_BINDING, '].set(Me, "', name, '",val)\r\n', '\tEnd Property\r\n'];
	    };
	
	    var genVBClassScript = function genVBClassScript(className, properties, accessors) {
	      var buffer = [],
	          i = undefined,
	          l = undefined,
	          name = undefined,
	          added = [];
	
	      buffer.push('Class ', className, '\r\n', CONST_SCRIPT, '\r\n');
	
	      //添加访问器属性
	      for (i = 0, l = accessors.length; i < l; i++) {
	        name = accessors[i];
	        buffer.push.apply(buffer, genVBClassPropertySetterScript(name));
	        buffer.push.apply(buffer, genVBClassPropertyGetterScript(name));
	        added.push(name);
	      }
	
	      //添加普通属性,因为VBScript对象不能像JS那样随意增删属性，必须在这里预先定义好
	      for (i = 0, l = properties.length; i < l; i++) {
	        name = properties[i];
	        if (_.indexOf.call(added, name) == -1) buffer.push('\tPublic [', name, ']\r\n');
	      }
	      buffer.push('End Class\r\n');
	      return buffer.join('');
	    };
	
	    var genVBClass = function genVBClass(properties, accessors) {
	      var buffer = [],
	          className = undefined,
	          factoryName = undefined,
	          key = '[' + properties.join(',') + ']&&[' + accessors.join(',') + ']';
	      className = VBClassPool[key];
	      if (className) {
	        return parseVBClassFactoryName(className);
	      } else {
	        className = genClassName();
	        factoryName = parseVBClassFactoryName(className);
	        window.parseVB(genVBClassScript(className, properties, accessors));
	        window.parseVB(['Function ' + factoryName + '(desc)', //创建实例并传入两个关键的参数
	        '\tDim o', '\tSet o = (New ' + className + ')(desc)', '\tSet ' + factoryName + ' = o', 'End Function'].join('\r\n'));
	        VBClassPool[key] = className;
	        return factoryName;
	      }
	    };
	
	    var _createVBProxy = function _createVBProxy(object, desc) {
	      var accessors = [],
	          props = ['__hash__', '__destory__'],
	          i = undefined,
	          l = undefined,
	          bind = undefined;
	      desc = desc || new ObjectDescriptor(object);
	      for (name in object) {
	        accessors.push(name);
	      }
	
	      props = props.concat(OBJECT_PROTO_PROPS);
	      if (Object.prototype.toString.call(object) === '[object Array]') {
	        props = props.concat(ARRAY_PROTO_PROPS);
	      }
	
	      proxy = window[genVBClass(props, accessors)](desc);
	
	      proxy['hasOwnProperty'] = function hasOwnProperty(attr) {
	        return attr !== DESC_BINDING && attr !== CONST_BINDING && _.indexOf.call(props, attr) == -1;
	      };
	      proxy.__destory__ = function () {
	        if (VBProxyLoop.get(object) === proxy) {
	          VBProxyLoop['delete'](object);
	          proxyChange(object, object);
	        }
	      };
	      for (i = 0, l = props.length; i < l; i++) {
	        name = props[i];
	        if (typeof proxy[name] === 'undefined') {
	          bind = object[name];
	          if (typeof bind === 'function') {
	            bind = _.bind.call(bind, object);
	          }
	          proxy[name] = bind;
	        }
	      }
	      return proxy;
	    };
	
	    var Map = __webpack_require__(2);
	
	    var OBJECT_PROTO_PROPS = ['hasOwnProperty', 'toString', 'toLocaleString', 'isPrototypeOf', 'propertyIsEnumerable', 'valueOf'],
	        ARRAY_PROTO_PROPS = ['concat', 'copyWithin', 'entries', 'every', 'fill', 'filter', 'find', 'findIndex', 'forEach', 'indexOf', 'lastIndexOf', 'length', 'map', 'keys', 'join', 'pop', 'push', 'reverse', 'reverseRight', 'some', 'shift', 'slice', 'sort', 'splice', 'toSource', 'unshift'],
	        DESC_BINDING = '__PROXY__',
	        CONST_BINDING = '__VB_CONST__',
	        CONST_SCRIPT = ['\tPublic [' + DESC_BINDING + ']', '\tPublic Default Function [' + CONST_BINDING + '](desc)', '\t\tset [' + DESC_BINDING + '] = desc', '\t\tSet [' + CONST_BINDING + '] = Me', '\tEnd Function\r\n'].join('\r\n'),
	        VBClassPool = {},
	        VBProxyLoop = new Map(),
	        classId = 0;
	
	    var ObjectDescriptor = function () {
	      function ObjectDescriptor(object, defines) {
	        _classCallCheck(this, ObjectDescriptor);
	
	        this.object = object;
	        this.defines = defines || {};
	      }
	
	      ObjectDescriptor.prototype.isAccessor = function isAccessor(desc) {
	        return desc.get || desc.set;
	      };
	
	      ObjectDescriptor.prototype.hasAccessor = function hasAccessor() {
	        for (var attr in this.defines) {
	          if (this.isAccessor(this.defines[attr])) {
	            return true;
	          }
	        }
	        return false;
	      };
	
	      ObjectDescriptor.prototype.defineProperty = function defineProperty(attr, desc) {
	        if (!this.isAccessor(desc)) {
	          delete this.defines[attr];
	        } else {
	          this.defines[attr] = desc;
	          if (desc.get) {
	            this.object[attr] = desc.get();
	          }
	        }
	      };
	
	      ObjectDescriptor.prototype.getPropertyDefine = function getPropertyDefine(attr) {
	        return this.defines[attr];
	      };
	
	      ObjectDescriptor.prototype.get = function get(instance, attr) {
	        var define = this.defines[attr];
	        if (define && define.get) {
	          return define.get.call(instance);
	        } else {
	          return this.object[attr];
	        }
	      };
	
	      ObjectDescriptor.prototype.set = function set(instance, attr, value) {
	        var define = this.defines[attr];
	        if (define && define.set) {
	          define.set.call(instance, value);
	        }
	        this.object[attr] = value;
	      };
	
	      return ObjectDescriptor;
	    }();
	
	    var VBProxy = {
	      isVBProxy: function isVBProxy(object) {
	        return object && (typeof object === 'undefined' ? 'undefined' : _typeof(object)) == 'object' && CONST_BINDING in object;
	      },
	      getVBProxy: function getVBProxy(object, justInPool) {
	        if (VBProxy.isVBProxy(object)) {
	          if (justInPool === false) {
	            return VBProxyLoop.get(object[DESC_BINDING].object) || object;
	          }
	          object = object[DESC_BINDING].object;
	        }
	        return VBProxyLoop.get(object);
	      },
	      getVBProxyDesc: function getVBProxyDesc(object) {
	        var proxy = VBProxy.isVBProxy(object) ? object : VBProxyLoop.get(object);
	        return proxy ? proxy[DESC_BINDING] : undefined;
	      },
	      createVBProxy: function createVBProxy(object) {
	        var proxy = VBProxy.getVBProxy(object, false),
	            rebuild = false,
	            name = undefined,
	            desc = undefined;
	        if (proxy) {
	          object = proxy[DESC_BINDING].object;
	          rebuild = _.eachObj(object, function (v, name) {
	            return proxy.hasOwnProperty(name);
	          }) === false;
	          if (!rebuild) {
	            return proxy;
	          }
	          desc = proxy[DESC_BINDING];
	        }
	        proxy = _createVBProxy(object, desc);
	        VBProxyLoop.set(object, proxy);
	        proxyChange(object, proxy);
	        return proxy;
	      }
	    };
	    window.VBProxy = VBProxy;
	  })();
	}
	
	module.exports = window.VBProxy;

/***/ },
/* 9 */
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
	    var path = Exp._parseExpr(expression);
	
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