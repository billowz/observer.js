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
	
	var proxy = __webpack_require__(1),
	    Exp = __webpack_require__(3),
	    exp = __webpack_require__(9),
	    OBJECT = __webpack_require__(6);
	window.observer = {
	  on: exp.on,
	  un: exp.un,
	  hasListen: exp.hasListen,
	  obj: proxy.obj,
	  eq: proxy.eq,
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
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Map = __webpack_require__(2);
	
	var ProxyEventFactory = function () {
	  ProxyEventFactory.prototype.isEnable = function isEnable() {
	    return window.VBProxy;
	  };
	
	  ProxyEventFactory.prototype.eq = function eq(obj, obj2) {
	    return this.obj(obj) === this.obj(obj2);
	  };
	
	  ProxyEventFactory.prototype.obj = function obj(_obj) {
	    if (window.VBProxy && window.VBProxy.isVBProxy(_obj)) {
	      var desc = window.VBProxy.getVBProxyDesc(_obj);
	      return desc ? desc.object : undefined;
	    }
	    return _obj;
	  };
	
	  function ProxyEventFactory() {
	    _classCallCheck(this, ProxyEventFactory);
	
	    this.proxyEvents = new Map();
	  }
	
	  ProxyEventFactory.prototype.onProxy = function onProxy(obj, handler) {
	    var handlers = undefined;
	
	    if (!window.VBProxy) {
	      return;
	    }
	    if (typeof handler !== 'function') {
	      throw TypeError('Invalid Proxy Event Handler');
	    }
	    obj = this.obj(obj);
	    handlers = this.proxyEvents.get(obj);
	    if (!handlers) {
	      handlers = [];
	      this.proxyEvents.set(obj, handlers);
	    }
	    handlers.push(handler);
	  };
	
	  ProxyEventFactory.prototype.unProxy = function unProxy(obj, handler) {
	    var handlers = undefined;
	
	    if (!window.VBProxy) {
	      return;
	    }
	    obj = this.obj(obj);
	    handlers = this.proxyEvents.get(obj);
	    if (handlers) {
	      if (arguments.length > 1) {
	        if (typeof handler === 'function') {
	          var idx = _.indexOf.call(handlers, handler);
	          if (idx != -1) {
	            handlers.splice(idx, 1);
	          }
	        }
	      } else {
	        this.proxyEvents['delete'](obj);
	      }
	    }
	  };
	
	  ProxyEventFactory.prototype._fire = function _fire(obj, proxy) {
	    handlers = this.proxyEvents.get(obj);
	    if (handlers) {
	      for (var i = 0; i < handlers.length; i++) {
	        handlers[i](obj, proxy);
	      }
	    }
	  };
	
	  return ProxyEventFactory;
	}();
	
	module.exports = new ProxyEventFactory();

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
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var observer = __webpack_require__(4);
	var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
	    reIsPlainProp = /^\w*$/,
	    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;
	
	function baseToString(val) {
	  return val === undefined || val === null ? '' : val + '';
	}
	
	var Expression = function () {
	  Expression.toPath = function toPath(value) {
	    var result = [];
	    if (value instanceof Array) {
	      result = value;
	    } else if (value !== undefined && value !== null) {
	      (value + '').replace(rePropName, function (match, number, quote, string) {
	        result.push(quote ? string.replace(reEscapeChar, '$1') : number || match);
	      });
	    }
	    return result;
	  };
	
	  function Expression(target, expression, path) {
	    _classCallCheck(this, Expression);
	
	    this.expression = expression;
	    this.handlers = [];
	    this.path = path || Expression.toPath(expression);
	    this.observers = [];
	    this.observeHandlers = this._initObserveHandlers();
	    this.target = this._observe(target, 0);
	  }
	
	  Expression.get = function get(object, path, defaultValue) {
	    if (object) {
	      path = Expression.toPath(path);
	      var index = 0;
	
	      while (object && index < path.length) {
	        object = object[path[index++]];
	      }
	      return index === path.length ? object : undefined;
	    }
	    return defaultValue;
	  };
	
	  Expression.prototype._observe = function _observe(obj, idx) {
	    var attr = this.path[idx];
	
	    if (idx + 1 < this.path.length) {
	      obj[attr] = this._observe(obj[attr], idx + 1);
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
	    var handlers = [],
	        i = undefined;
	
	    for (i = 0; i < this.path.length; i++) {
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
	      if (ridx > 0) {
	        _this._unobserve(oldVal, idx + 1);
	        _this._observe(val, idx + 1);
	        oldVal = Expression.get(oldVal, rpath);
	        val = Expression.get(val, rpath);
	      }
	      if (val !== oldVal && _this.handlers) {
	        var hs = _this.handlers.slice();
	        for (var i = 0; i < hs.length; i++) {
	          _this.handlers[i](_this.expression, val, oldVal, _this.target);
	        }
	      }
	    };
	  };
	
	  Expression.prototype.addListen = function addListen() {
	    for (var i = 0; i < arguments.length; i++) {
	      if (typeof arguments[i] === 'function') {
	        this.handlers.push(arguments[i]);
	      }
	    }
	  };
	
	  Expression.prototype.removeListen = function removeListen() {
	    if (arguments.length == 0) {
	      this.handlers = [];
	    } else {
	      for (var i = 0; i < arguments.length; i++) {
	        if (typeof arguments[i] === 'function') {
	          var idx = _.indexOf.call(this.handlers, arguments[i]);
	          if (idx !== -1) {
	            this.handlers.splice(idx, 1);
	          }
	        }
	      }
	    }
	  };
	
	  Expression.prototype.hasListen = function hasListen(handler) {
	    if (arguments.length) return _.indexOf.call(this.handlers, handler) !== -1;
	    return !!this.handlers.length;
	  };
	
	  Expression.prototype.destory = function destory() {
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
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Observer = __webpack_require__(5),
	    Map = __webpack_require__(2),
	    proxy = __webpack_require__(1);
	
	var observers = new Map();
	var factory = {
	  _bind: function _bind(observer) {
	    observers.set(proxy.obj(observer.target), observer);
	  },
	  _unbind: function _unbind(observer) {
	    var target = proxy.obj(observer.target);
	
	    if (observers.get(target) === observer) {
	      observers['delete'](target);
	    }
	  },
	  _get: function _get(target) {
	    return observers.get(proxy.obj(target));
	  },
	  hasListen: function hasListen(obj) {
	    var observer = factory._get(obj);
	
	    if (!observer) {
	      return false;
	    } else if (arguments.length == 1) {
	      return true;
	    } else {
	      return observer.hasListen.apply(observer, Array.prototype.slice.call(arguments, 1));
	    }
	  },
	  on: function on(obj) {
	    var observer = undefined;
	
	    obj = proxy.obj(obj);
	    observer = factory._get(obj);
	    if (!observer) {
	      observer = new Observer(obj);
	      factory._bind(observer);
	    }
	    obj = observer.on.apply(observer, Array.prototype.slice.call(arguments, 1));
	    if (!observer.hasListen()) {
	      factory._unbind(observer);
	      observer.destroy();
	    }
	    return obj;
	  },
	  un: function un(obj) {
	    var observer = undefined;
	
	    obj = proxy.obj(obj);
	    observer = factory._get(obj);
	    if (observer) {
	      obj = observer.un.apply(observer, Array.prototype.slice.call(arguments, 1));
	      if (!observer.hasListen()) {
	        factory._unbind(observer);
	        observer.destroy();
	      }
	    }
	    return obj;
	  }
	};
	module.exports = factory;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var OBJECT = __webpack_require__(6),
	    proxy = __webpack_require__(1),
	    _ = __webpack_require__(8);
	
	var arrayHockMethods = ['push', 'pop', 'shift', 'unshift', 'sort', 'reverse', 'splice'];
	
	var Observer = function () {
	  function Observer(target) {
	    _classCallCheck(this, Observer);
	
	    if (target instanceof Array) {
	      this.isArray = true;
	    } else if (target && (typeof target === 'undefined' ? 'undefined' : _typeof(target)) === 'object') {
	      this.isArray = false;
	    } else {
	      throw TypeError('can not observe object[' + (typeof target === 'undefined' ? 'undefined' : _typeof(target)) + ']');
	    }
	    this.target = target;
	    this.watchers = {};
	    this.listens = {};
	    this.changeRecords = {};
	    this._notify = _.bind.call(this._notify, this);
	    this._onObserveChanged = _.bind.call(this._onObserveChanged, this);
	    this._onStateChanged = _.bind.call(this._onStateChanged, this);
	  }
	
	  Observer.prototype._notify = function _notify() {
	    var _this = this;
	
	    _.eachObj(this.changeRecords, function (oldVal, attr) {
	      var val = _this.target[attr];
	
	      if (!proxy.eq(val, oldVal)) {
	        var handlers = _this.listens[attr],
	            i = undefined;
	
	        for (i = 0; i < handlers.length; i++) {
	          handlers[i](attr, val, oldVal, _this.target);
	        }
	      }
	    });
	    this.request_frame = null;
	    this.changeRecords = {};
	  };
	
	  Observer.prototype._addChangeRecord = function _addChangeRecord(attr, oldVal) {
	    if (!(attr in this.changeRecords)) {
	      this.changeRecords[attr] = oldVal;
	      if (!this.request_frame) this.request_frame = _.requestAnimationFrame(this._notify);
	    }
	  };
	
	  Observer.prototype._onStateChanged = function _onStateChanged(attr, oldVal) {
	    this._addChangeRecord(attr, oldVal);
	  };
	
	  Observer.prototype._onObserveChanged = function _onObserveChanged(changes) {
	    for (var i = 0; i < changes.length; i++) {
	      if (this.listens[changes[i].name]) this._onStateChanged(changes[i].name, changes[i].oldValue);
	    }
	  };
	
	  Observer.prototype._defineProperty = function _defineProperty(attr, value) {
	    var _this2 = this;
	
	    this.target = OBJECT.defineProperty(this.target, attr, {
	      enumerable: true,
	      configurable: true,
	      get: function get() {
	        return value;
	      },
	      set: function set(val) {
	        var oldVal = value;
	        value = val;
	        _this2._onStateChanged(attr, oldVal);
	      }
	    });
	  };
	
	  Observer.prototype._undefineProperty = function _undefineProperty(attr, value) {
	    this.target = OBJECT.defineProperty(this.target, attr, {
	      enumerable: true,
	      configurable: true,
	      value: value
	    });
	  };
	
	  Observer.prototype._hockArrayLength = function _hockArrayLength(method) {
	    var self = this;
	
	    this.target[method] = function () {
	      var len = this.length;
	
	      Array.prototype[method].apply(this, arguments);
	      if (self.target.length !== len) self._onStateChanged('length', len);
	    };
	  };
	
	  Observer.prototype._watch = function _watch(attr) {
	    if (Object.observe) {
	      if (!this.es7observe) {
	        Object.observe(this.target, this._onObserveChanged);
	        this.es7observe = true;
	      }
	    } else if (!this.watchers[attr]) {
	      if (this.isArray && attr === 'length') {
	        for (var i = 0; i < arrayHockMethods.length; i++) {
	          this._hockArrayLength(arrayHockMethods[i]);
	        }
	      } else {
	        this._defineProperty(attr, this.target[attr]);
	      }
	      this.watchers[attr] = true;
	    }
	  };
	
	  Observer.prototype._unwatch = function _unwatch(attr) {
	    if (Object.observe) {
	      if (this.es7observe && !this.hasListen()) {
	        Object.unobserve(this.target, this._onObserveChanged);
	        this.es7observe = false;
	      }
	    } else if (this.watchers[attr]) {
	      if (this.isArray && attr === 'length') {
	        for (var i = 0; i < arrayHockMethods.length; i++) {
	          delete this.target[arrayHockMethods[i]];
	        }
	      } else {
	        this._undefineProperty(attr, this.target[attr]);
	      }
	      delete this.watchers[attr];
	    }
	  };
	
	  Observer.prototype._addListen = function _addListen(attr, handler) {
	    var _handlers = this.listens[attr];
	
	    if (!_handlers) _handlers = this.listens[attr] = [];
	
	    _handlers.push(handler);
	
	    this._watch(attr);
	  };
	
	  Observer.prototype._removeListen = function _removeListen(attr, handler) {
	    var _handlers = undefined,
	        idx = undefined,
	        i = undefined;
	
	    if (attr in this.listens) {
	      _handlers = this.listens[attr] || [];
	      if (!handler) {
	        _handlers = [];
	      } else if ((idx = _.indexOf.call(_handlers, handler)) !== -1) {
	        _handlers.splice(idx, 1);
	      }
	      if (!_handlers.length) {
	        delete this.listens[attr];
	        this._unwatch(attr);
	      }
	    }
	  };
	
	  Observer.prototype.hasListen = function hasListen(attr, handler) {
	    if (arguments.length === 0) {
	      return _.eachObj(this.listens, function () {
	        return false;
	      }) === false;
	    } else if (arguments.length === 1) {
	      if (typeof attr === 'function') {
	        return _.eachObj(this.listens, function (h, a) {
	          return _.indexOf.call(h, attr) === -1;
	        }) === false;
	      } else {
	        return !!this.listens[attr];
	      }
	    } else {
	      return this.listens[attr] && _.indexOf.call(this.listens[attr], handler) !== -1;
	    }
	  };
	
	  Observer.prototype.on = function on(attrs, handler) {
	    var _this3 = this;
	
	    if (arguments.length == 1) {
	      if (typeof attrs === 'function') {
	        if (this.isArray) {
	          for (var i = 0; i < this.target.length; i++) {
	            this._addListen(i + '', attrs);
	          }
	          this._addListen('length', attrs);
	        } else {
	          _.eachObj(this.target, function (v, attr) {
	            _this3._addListen(attr, attrs);
	          });
	        }
	      } else if (attrs && (typeof attrs === 'undefined' ? 'undefined' : _typeof(attrs)) === 'object') {
	        _.eachObj(attrs, function (h, attr) {
	          if (typeof h !== 'function') {
	            throw TypeError("Invalid Observer Handler", h);
	          }
	          _this3._addListen(attr, h);
	        });
	      } else {
	        throw TypeError('Invalid Parameter', arguments);
	      }
	    } else if (arguments.length >= 2) {
	      var i = undefined,
	          _attrs = [],
	          _handler = undefined;
	
	      for (i = 0; i < arguments.length; i++) {
	        if (typeof arguments[i] === 'function') {
	          _handler = arguments[i];
	          break;
	        }
	        if (arguments[i] instanceof Array) {
	          _attrs.push.apply(_attrs, arguments[i]);
	        } else {
	          _attrs.push(arguments[i]);
	        }
	      }
	      if (!_handler) {
	        throw TypeError("Invalid Observer Handler", _handler);
	      }
	      for (i = 0; i < _attrs.length; i++) {
	        this._addListen(_attrs[i] + '', _handler);
	      }
	    } else {
	      throw TypeError('Invalid Parameter', arguments);
	    }
	    return this.target;
	  };
	
	  Observer.prototype.un = function un(attrs, handler) {
	    var _this4 = this;
	
	    if (arguments.length == 0) {
	      if (this.isArray) {
	        for (var i = 0; i < this.target.length; i++) {
	          this._removeListen(i + '');
	        }
	        this._removeListen('length');
	      } else {
	        _.eachObj(this.target, function (v, attr) {
	          _this4._removeListen(attr);
	        });
	      }
	    } else if (arguments.length == 1) {
	      if (typeof attrs === 'function') {
	        if (this.isArray) {
	          for (var i = 0; i < this.target.length; i++) {
	            this._removeListen(i + '', attrs);
	          }
	          this._removeListen('length', attrs);
	        } else {
	          _.eachObj(this.target, function (v, attr) {
	            _this4._removeListen(attr, attrs);
	          });
	        }
	      } else if (attrs instanceof Array) {
	        for (var i = 0; i < attrs.length; i++) {
	          this._removeListen(attrs[i] + '');
	        }
	      } else if (attrs && (typeof attrs === 'undefined' ? 'undefined' : _typeof(attrs)) === 'object') {
	        _.eachObj(attrs, function (h, attr) {
	          _this4._removeListen(attr, h);
	        });
	      } else {
	        this._removeListen(attrs + '');
	      }
	    } else if (arguments.length >= 2) {
	      var i = undefined,
	          _attrs = [],
	          _handler = undefined;
	
	      for (i = 0; i < arguments.length; i++) {
	        if (typeof arguments[i] === 'function') {
	          _handler = arguments[i];
	          break;
	        }
	        if (arguments[i] instanceof Array) {
	          _attrs.push.apply(_attrs, arguments[i]);
	        } else {
	          _attrs.push(arguments[i]);
	        }
	      }
	      for (i = 0; i < _attrs.length; i++) {
	        this._removeListen(_attrs[i] + '', _handler);
	      }
	    } else {
	      throw TypeError('Invalid Parameter', arguments);
	    }
	    return this.target;
	  };
	
	  Observer.prototype.destroy = function destroy() {
	    var _this5 = this;
	
	    _.eachObj(this.listens, function (h, attr) {
	      _this5._removeListen(attr, h);
	    });
	    if (this.request_frame) {
	      _.cancelAnimationFrame(this.request_frame);
	      this.request_frame = undefined;
	    }
	    this.target = undefined;
	    this.watchers = undefined;
	    this.listens = undefined;
	    this.changeRecords = undefined;
	  };
	
	  return Observer;
	}();
	
	module.exports = Observer;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	/**
	 * 修复浏览器(IE 6,7,8)对Object.defineProperty的支持，使用VBProxy
	 */
	
	function doesDefinePropertyWork(object) {
	  try {
	    var _ret = function () {
	      var val = undefined;
	      Object.defineProperty(object, 'sentinel', {
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
	if (!Object.defineProperty || !doesDefinePropertyWork({})) {
	  (function () {
	    var VBProxy = __webpack_require__(7);
	    if (VBProxy) {
	      OBJECT = {
	        defineProperty: function defineProperty(object, prop, desc) {
	          var descs = {};
	          descs[prop] = desc;
	          return OBJECT.defineProperties(object, descs);
	        },
	        defineProperties: function defineProperties(object, descs) {
	          var proxy = undefined,
	              prop = undefined,
	              proxyDesc = undefined,
	              hasAccessor = false,
	              desc = undefined;
	          if (VBProxy.isVBProxy(object)) {
	            proxy = object;
	            object = VBProxy.getVBProxyDesc(proxy).object;
	          }
	          for (prop in descs) {
	            desc = descs[prop];
	            if (desc.get || desc.set) {
	              hasAccessor = true;
	              break;
	            }
	          }
	          if (!proxy && !hasAccessor) {
	            for (prop in descs) {
	              object[prop] = descs[prop].value;
	            }
	            return object;
	          } else {
	            // fill non-props
	            for (prop in descs) {
	              if (!(prop in object)) {
	                object[prop] = undefined;
	              }
	            }
	            proxy = VBProxy.createVBProxy(proxy || object);
	            proxyDesc = VBProxy.getVBProxyDesc(proxy);
	            for (prop in descs) {
	              proxyDesc.defineProperty(prop, descs[prop]);
	            }
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
	              if (!(attr in proxy)) {
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
	  })();
	}
	module.exports = OBJECT;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * 使用VBScript对象代理js对象的get/set方法, 参考Avalon实现
	 * @see  https://github.com/RubyLouvre/avalon/blob/master/src/08%20modelFactory.shim.js
	 */
	var _ = __webpack_require__(8);
	var proxyEvent = __webpack_require__(1);
	
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
	          name = undefined,
	          added = [];
	
	      buffer.push('Class ', className, '\r\n', CONST_SCRIPT, '\r\n');
	
	      //添加访问器属性
	      for (i = 0; i < accessors.length; i++) {
	        name = accessors[i];
	        buffer.push.apply(buffer, genVBClassPropertySetterScript(name));
	        buffer.push.apply(buffer, genVBClassPropertyGetterScript(name));
	        added.push(name);
	      }
	
	      //添加普通属性,因为VBScript对象不能像JS那样随意增删属性，必须在这里预先定义好
	      for (i = 0; i < properties.length; i++) {
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
	          proxyEvent._fire(object, object);
	        }
	      };
	      for (i = 0; i < props.length; i++) {
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
	          for (name in object) {
	            if (!(name in proxy)) {
	              rebuild = true;
	              break;
	            }
	          }
	          if (!rebuild) {
	            return proxy;
	          }
	          desc = proxy[DESC_BINDING];
	        }
	        proxy = _createVBProxy(object, desc);
	        VBProxyLoop.set(object, proxy);
	        proxyEvent._fire(object, proxy);
	        return proxy;
	      }
	    };
	    window.VBProxy = VBProxy;
	  })();
	}
	
	module.exports = window.VBProxy;

/***/ },
/* 8 */
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
	
	  hasProp: function hasProp(obj, prop) {
	    return Object.prototype.hasOwnProperty.call(obj, prop);
	  },
	  eachObj: function eachObj(obj, callback) {
	    for (var i in obj) {
	      if (obj.hasOwnProperty(i)) {
	        if (callback(obj[i], i) === false) return false;
	      }
	    }
	  },
	
	
	  bind: bind,
	
	  indexOf: Array.prototype.indexOf || function indexOf(val) {
	    for (var i = 0; i < this.length; i++) {
	      if (this[i] === val) {
	        return i;
	      }
	    }
	    return -1;
	  }
	
	};
	
	module.exports = util;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var Exp = __webpack_require__(3),
	    observer = __webpack_require__(4),
	    Map = __webpack_require__(2),
	    proxy = __webpack_require__(1),
	    _ = __webpack_require__(8);
	
	var exps = new Map();
	var factory = {
	  _bind: function _bind(exp) {
	    var obj = proxy.obj(exp.target),
	        map = exps.get(obj);
	
	    if (!map) {
	      map = {};
	      exps.set(obj, map);
	    }
	    map[exp.expression] = exp;
	  },
	  _unbind: function _unbind(exp) {
	    var obj = proxy.obj(exp.target),
	        map = exps.get(obj);
	
	    if (map && map[exp.expression] === exp) {
	      delete map[exp.expression];
	
	      for (var key in map) {
	        if (_.hasProp(map, key)) return;
	      }
	      exps['delete'](obj);
	    }
	  },
	  _get: function _get(obj, exp) {
	    var map = undefined;
	
	    obj = proxy.obj(obj);
	    map = exps.get(obj);
	    if (map) return map[exp];
	    return undefined;
	  },
	  _on: function _on(obj, exp, handler) {
	    var path = Exp.toPath(exp);
	
	    if (path.length > 1) {
	      var _exp = factory._get(obj, exp);
	
	      if (!_exp) {
	        _exp = new Exp(obj, exp, path);
	        factory._bind(_exp);
	      }
	      _exp.addListen(handler);
	      return _exp.target;
	    } else {
	      return observer.on(obj, exp, handler);
	    }
	  },
	  _un: function _un(obj, exp, handler) {
	    var path = Exp.toPath(exp);
	
	    if (path.length > 1) {
	      var _exp = factory._get(obj, exp);
	
	      if (_exp) {
	        if (arguments.length > 2) {
	          _exp.removeListen(handler);
	        } else {
	          _exp.removeListen();
	        }
	        if (!_exp.hasListen()) {
	          factory._unbind(_exp);
	          return _exp.destory();
	        }
	        return _exp.target;
	      } else {
	        var ob = observer._get(obj);
	
	        return ob ? ob.target : proxy.obj(obj);
	      }
	    } else {
	      return observer.un(obj, exp, handler);
	    }
	  },
	  hasListen: function hasListen(obj, exp, handler) {
	    if (!exp || typeof exp === 'function' || !Exp.toPath(exp).length) {
	      return observer.hasListen.apply(observer, arguments);
	    } else {
	      var _exp = factory._get(obj, exp);
	      if (_exp) {
	        if (arguments.length == 2) {
	          return true;
	        }
	        return _exp.hasListen(handler);
	      }
	      return false;
	    }
	  },
	  on: function on(obj) {
	    if (arguments.length < 2) {
	      throw TypeError('Invalid Parameter');
	    } else if (arguments.length === 2) {
	      var p1 = arguments[1];
	      if (typeof p1 === 'function') {
	        return observer.on(obj, p1);
	      } else if (p1 && (typeof p1 === 'undefined' ? 'undefined' : _typeof(p1)) === 'object') {
	        _.eachObj(p1, function (h, exp) {
	          if (typeof h !== 'function') {
	            throw TypeError('Invalid Observer Handler');
	          }
	          obj = factory._on(obj, exp, h);
	        });
	      } else {
	        throw TypeError('Invalid Parameter');
	      }
	    } else if (arguments.length >= 3) {
	      var i = undefined,
	          _exps = [],
	          _handler = undefined;
	
	      for (i = 1; i < arguments.length; i++) {
	        if (typeof arguments[i] === 'function') {
	          _handler = arguments[i];
	          break;
	        }
	        if (arguments[i] instanceof Array) {
	          _exps.push.apply(_exps, arguments[i]);
	        } else {
	          _exps.push(arguments[i]);
	        }
	      }
	      if (!_handler) {
	        throw TypeError("Invalid Observer Handler", _handler);
	      }
	      for (i = 0; i < _exps.length; i++) {
	        obj = factory._on(obj, _exps[i] + '', _handler);
	      }
	    }
	    return obj;
	  },
	  un: function un(obj) {
	    if (arguments.length < 1) {
	      throw TypeError('Invalid Parameter');
	    } else if (arguments.length === 1) {
	      return observer.un(obj);
	    } else if (arguments.length === 2) {
	      var p1 = arguments[1];
	      if (typeof p1 === 'function') {
	        obj = observer.un(obj, p1);
	      } else if (p1 instanceof Array) {
	        for (var i = 0; i < p1.length; i++) {
	          obj = factory._on(obj, p1);
	        }
	      } else if (p1 && (typeof p1 === 'undefined' ? 'undefined' : _typeof(p1)) === 'object') {
	        _.eachObj(p1, function (h, exp) {
	          obj = factory._un(obj, exp, h);
	        });
	      } else {
	        obj = factory._un(obj, p1 + '');
	      }
	    } else if (arguments.length >= 3) {
	      var i = undefined;
	
	      exps = [];
	      handler = undefined;
	      for (i = 1; i < arguments.length; i++) {
	        if (typeof arguments[i] === 'function') {
	          handler = arguments[i];
	          break;
	        }
	        if (arguments[i] instanceof Array) {
	          exps.push.apply(exps, arguments[i]);
	        } else {
	          exps.push(arguments[i]);
	        }
	      }
	      for (i = 0; i < exps.length; i++) {
	        obj = factory._un(obj, exps[i] + '', handler);
	      }
	    }
	    return obj;
	  }
	};
	module.exports = factory;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=observer.js.map