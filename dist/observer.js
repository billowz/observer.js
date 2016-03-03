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
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _proxyEvent = __webpack_require__(1);
	
	var _proxyEvent2 = _interopRequireDefault(_proxyEvent);
	
	var _expFactory = __webpack_require__(3);
	
	var _expFactory2 = _interopRequireDefault(_expFactory);
	
	_expFactory2['default'].proxy = _proxyEvent2['default'];
	_expFactory2['default'].obj = _proxyEvent2['default'].obj.bind(_proxyEvent2['default']);
	_expFactory2['default'].eq = _proxyEvent2['default'].eq.bind(_proxyEvent2['default']);
	window.observer = _expFactory2['default'];
	exports['default'] = _expFactory2['default'];
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _map = __webpack_require__(2);
	
	var _map2 = _interopRequireDefault(_map);
	
	var ProxyEventFactory = (function () {
	  _createClass(ProxyEventFactory, [{
	    key: 'isEnable',
	    value: function isEnable() {
	      return window.VBProxy;
	    }
	  }, {
	    key: 'eq',
	    value: function eq(obj, obj2) {
	      return this.obj(obj) === this.obj(obj2);
	    }
	  }, {
	    key: 'obj',
	    value: function obj(_obj) {
	      if (window.VBProxy && window.VBProxy.isVBProxy(_obj)) return window.VBProxy.getVBProxyDesc(_obj).object;
	      return _obj;
	    }
	  }]);
	
	  function ProxyEventFactory() {
	    _classCallCheck(this, ProxyEventFactory);
	
	    this.proxyEvents = new _map2['default']();
	  }
	
	  _createClass(ProxyEventFactory, [{
	    key: 'onProxy',
	    value: function onProxy(obj, handler) {
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
	    }
	  }, {
	    key: 'unProxy',
	    value: function unProxy(obj, handler) {
	      var handlers = undefined;
	
	      if (!window.VBProxy) {
	        return;
	      }
	      obj = this.obj(obj);
	      handlers = this.proxyEvents.get(obj);
	      if (handlers) {
	        if (arguments.length > 1) {
	          if (typeof handler === 'function') {
	            var idx = handlers.indexOf(handler);
	            if (idx != -1) {
	              handlers.splice(idx, 1);
	            }
	          }
	        } else {
	          this.proxyEvents['delete'](obj);
	        }
	      }
	    }
	  }, {
	    key: '_fire',
	    value: function _fire(proxy) {
	      if (window.VBProxy && window.VBProxy.isVBProxy(proxy)) {
	        var obj = window.VBProxy.getVBProxyDesc(obj).object,
	            handlers = this.proxyEvents.get(obj);
	
	        if (handlers) {
	          for (var i = 0; i < handlers.length; i++) {
	            handlers[i](obj, proxy);
	          }
	        }
	      }
	    }
	  }]);
	
	  return ProxyEventFactory;
	})();
	
	exports['default'] = new ProxyEventFactory();
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var Map = window.Map;
	if (!Map) {
	  (function () {
	    var hash = function hash(value) {
	      return typeof value + ' ' + (value && (typeof value == 'object' || typeof value == 'function') ? value[HASH_BIND] || (value[HASH_BIND] = ++objHashIdx) : value + '');
	    };
	
	    var ITERATOR_TYPE = {
	      KEY: 'key',
	      VALUE: 'value',
	      ENTRY: 'entry'
	    },
	        HASH_BIND = '__hash__',
	        objHashIdx = 0;
	
	    var _Map = (function () {
	      function _Map() {
	        _classCallCheck(this, _Map);
	
	        this._map = {};
	        this._keyMap = {};
	        this._size = 0;
	      }
	
	      _createClass(_Map, [{
	        key: 'has',
	        value: function has(key) {
	          return hash(key) in this._keyMap;
	        }
	      }, {
	        key: 'get',
	        value: function get(key) {
	          var hcode = hash(key);
	          if (hcode in this._keyMap) {
	            return this._map[hcode];
	          }
	          return undefined;
	        }
	      }, {
	        key: 'set',
	        value: function set(key, val) {
	          var hcode = hash(key);
	          this._keyMap[hcode] = key;
	          this._map[hcode] = val;
	          if (!(hcode in this._keyMap)) {
	            this._size++;
	          }
	          return this;
	        }
	      }, {
	        key: 'delete',
	        value: function _delete(key) {
	          var hcode = hash(key);
	          if (hcode in this._keyMap) {
	            delete this._keyMap[hcode];
	            delete this._map[hcode];
	            this._size--;
	            return true;
	          }
	          return false;
	        }
	      }, {
	        key: 'size',
	        value: function size() {
	          return this._size;
	        }
	      }, {
	        key: 'clear',
	        value: function clear() {
	          this._keyMap = {};
	          this._map = {};
	          this._size = 0;
	        }
	      }, {
	        key: 'forEach',
	        value: function forEach(callback) {
	          for (var key in this._map) {
	            if (key in this._keyMap) callback(this._map[key], key, this);
	          }
	        }
	      }, {
	        key: 'keys',
	        value: function keys() {
	          return new MapIterator(this, ITERATOR_TYPE.KEY);
	        }
	      }, {
	        key: 'values',
	        value: function values() {
	          return new MapIterator(this, ITERATOR_TYPE.VALUE);
	        }
	      }, {
	        key: 'entries',
	        value: function entries() {
	          return new MapIterator(this, ITERATOR_TYPE.ENTRY);
	        }
	      }, {
	        key: 'toString',
	        value: function toString() {
	          return '[Object Map]';
	        }
	      }]);
	
	      return _Map;
	    })();
	
	    var MapIterator = (function () {
	      function MapIterator(map, type) {
	        _classCallCheck(this, MapIterator);
	
	        this._index = 0;
	        this._map = map;
	        this._type = type;
	      }
	
	      _createClass(MapIterator, [{
	        key: 'next',
	        value: function next() {
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
	        }
	      }, {
	        key: 'toString',
	        value: function toString() {
	          return '[object Map Iterator]';
	        }
	      }]);
	
	      return MapIterator;
	    })();
	
	    Map = _Map;
	  })();
	}
	exports['default'] = Map;
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _exp3 = __webpack_require__(4);
	
	var _exp4 = _interopRequireDefault(_exp3);
	
	var _factory = __webpack_require__(5);
	
	var _factory2 = _interopRequireDefault(_factory);
	
	var _map = __webpack_require__(2);
	
	var _map2 = _interopRequireDefault(_map);
	
	var _proxyEvent = __webpack_require__(1);
	
	var _proxyEvent2 = _interopRequireDefault(_proxyEvent);
	
	var _util = __webpack_require__(9);
	
	var _util2 = _interopRequireDefault(_util);
	
	var ExpressionFactory = (function () {
	  function ExpressionFactory() {
	    _classCallCheck(this, ExpressionFactory);
	
	    this.exps = new _map2['default']();
	  }
	
	  _createClass(ExpressionFactory, [{
	    key: '_bind',
	    value: function _bind(exp) {
	      var obj = _proxyEvent2['default'].obj(exp.target),
	          map = this.exps.get(obj);
	
	      if (!map) {
	        map = {};
	        this.exps.set(obj, map);
	      }
	      map[exp.expression] = exp;
	    }
	  }, {
	    key: '_unbind',
	    value: function _unbind(exp) {
	      var obj = _proxyEvent2['default'].obj(exp.target),
	          map = this.exps.get(obj);
	
	      if (map && map[exp.expression] === exp) {
	        delete map[exp.expression];
	
	        for (var key in map) {
	          if (_util2['default'].hasProp(map, key)) return;
	        }
	        this.exps['delete'](obj);
	      }
	    }
	  }, {
	    key: '_get',
	    value: function _get(obj, exp) {
	      var map = undefined;
	
	      obj = _proxyEvent2['default'].obj(exp.target);
	      map = this.exps.get(obj);
	      if (map) return map[exp];
	      return undefined;
	    }
	  }, {
	    key: '_on',
	    value: function _on(obj, exp, handler) {
	      var path = _exp4['default'].toPath(exp);
	
	      if (path.length > 1) {
	        var _exp = this._get(obj, _exp);
	
	        if (!_exp) {
	          _exp = new _exp4['default'](obj, _exp, path);
	          this._bind(_exp);
	        }
	        _exp.addListen(handler);
	        return _exp.target;
	      } else {
	        return _factory2['default'].on(obj, exp, handler);
	      }
	    }
	  }, {
	    key: '_un',
	    value: function _un(obj, exp, handler) {
	      var path = _exp4['default'].toPath(exp);
	
	      if (path.length > 1) {
	        var _exp2 = this._get(obj, _exp2);
	
	        if (_exp2) {
	          _exp2.removeListen(handler);
	        }
	        if (!_exp2.hashListen()) {
	          this._unbind(_exp2);
	          return _exp2.destory();
	        }
	        return _exp2.target;
	      } else {
	        return _factory2['default'].un(obj, exp, handler);
	      }
	    }
	  }, {
	    key: 'hasListen',
	    value: function hasListen(obj, exp, handler) {
	      if (!exp || !_exp4['default'].toPath(exp).length) {
	        return _factory2['default'].hasListen.apply(_factory2['default'], arguments);
	      }
	    }
	  }, {
	    key: 'on',
	    value: function on(obj) {
	      var _this = this;
	
	      if (arguments.length < 2) {
	        throw TypeError('Invalid Parameter');
	      } else if (arguments.length === 2) {
	        var p1 = arguments[1];
	        if (typeof p1 === 'function') {
	          return _factory2['default'].on(obj, p1);
	        } else if (p1 && typeof p1 === 'object') {
	          _util2['default'].eachObj(p1, function (h, exp) {
	            if (typeof h !== 'function') {
	              throw TypeError('Invalid Observer Handler');
	            }
	            obj = _this._on(obj, exp, h);
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
	        console.log(_exps, ', ', _handler);
	        for (i = 0; i < _exps.length; i++) {
	          obj = this._on(obj, _exps[i] + '', _handler);
	        }
	      }
	      return obj;
	    }
	  }, {
	    key: 'un',
	    value: function un(obj) {
	      var _this2 = this;
	
	      if (arguments.length < 1) {
	        throw TypeError('Invalid Parameter');
	      } else if (arguments.length === 1) {
	        return _factory2['default'].un(obj);
	      } else if (arguments.length === 2) {
	        var p1 = arguments[1];
	        if (typeof p1 === 'function') {
	          obj = _factory2['default'].un(obj, p1);
	        } else if (p1 instanceof Array) {
	          for (var i = 0; i < p1.length; i++) {
	            obj = this._on(obj, p1);
	          }
	        } else if (p1 && typeof p1 === 'object') {
	          _util2['default'].eachObj(p1, function (h, exp) {
	            obj = _this2._un(obj, exp, h);
	          });
	        } else {
	          obj = this._un(obj, p1 + '');
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
	          obj = this._un(obj, exps[i] + '', handler);
	        }
	      }
	      return obj;
	    }
	  }]);
	
	  return ExpressionFactory;
	})();
	
	exports['default'] = new ExpressionFactory();
	module.exports = exports['default'];

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _factory = __webpack_require__(5);
	
	var _factory2 = _interopRequireDefault(_factory);
	
	var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;
	
	function baseToString(val) {
	  return val === undefined || val === null ? '' : val + '';
	}
	
	var Expression = (function () {
	  _createClass(Expression, null, [{
	    key: 'toPath',
	    value: function toPath(value) {
	      var result = [];
	      if (typeof value === 'string') {
	        baseToString(value).replace(rePropName, function (match, number, quote, string) {
	          result.push(quote ? string.replace(reEscapeChar, '$1') : number || match);
	        });
	      }
	      return result;
	    }
	  }]);
	
	  function Expression(target, expression, path) {
	    _classCallCheck(this, Expression);
	
	    this.expression = expression;
	    this.handlers = [];
	    this.path = path || Expression.toPath(expression);
	    this.observers = [];
	    this.observeHandlers = this._initObserveHandlers();
	    this.target = this._observe(target, 0);
	  }
	
	  _createClass(Expression, [{
	    key: '_observe',
	    value: function _observe(obj, idx) {
	      var attr = this.path[idx];
	
	      if (idx + 1 < this.path.length) obj[attr] = this._observe(obj[attr], idx + 1);
	      return _factory2['default'].on(obj, attr, this.observeHandlers[idx]);
	    }
	  }, {
	    key: '_unobserve',
	    value: function _unobserve(obj, idx) {
	      var attr = this.path[idx];
	
	      obj = _factory2['default'].un(obj, attr, this.observeHandlers[idx]);
	      if (idx + 1 < this.path.length) obj[attr] = this._unobserve(obj[attr], idx + 1);
	      return obj;
	    }
	  }, {
	    key: '_initObserveHandlers',
	    value: function _initObserveHandlers() {
	      var handlers = [],
	          i = undefined;
	
	      for (i = 0; i < this.path; i++) {
	        handlers[i] = this._createObserveHandler(i);
	      }
	      return handlers;
	    }
	  }, {
	    key: '_createObserveHandler',
	    value: function _createObserveHandler(idx) {
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
	          for (var i = 0; i < _this.handlers.length; i++) {
	            _this.handlers[i](_this.expression, val, oldVal, _this.target);
	          }
	        }
	      };
	    }
	  }, {
	    key: 'addListen',
	    value: function addListen() {
	      for (var i = 0; i < arguments.length; i++) {
	        if (typeof arguments[i] === 'function') {
	          this.handlers.push(arguments[i]);
	        }
	      }
	    }
	  }, {
	    key: 'removeListen',
	    value: function removeListen() {
	      if (arguments.length == 0) {
	        this.handlers = [];
	      } else {
	        for (var i = 0; i < arguments.length; i++) {
	          if (typeof arguments[i] === 'function') {
	            var idx = this.handlers.indexOf(arguments[i]);
	            if (idx !== -1) {
	              this.handlers.splice(idx, 1);
	            }
	          }
	        }
	      }
	    }
	  }, {
	    key: 'hasListen',
	    value: function hasListen() {
	      return !!this.handlers.length;
	    }
	  }, {
	    key: 'destory',
	    value: function destory() {
	      var obj = this._unobserve(this.target, 0);
	      this.target = undefined;
	      this.expression = undefined;
	      this.handlers = undefined;
	      this.path = undefined;
	      this.observers = undefined;
	      this.observeHandlers = undefined;
	      this.target = undefined;
	      return obj;
	    }
	  }], [{
	    key: 'get',
	    value: function get() {}
	  }]);
	
	  return Expression;
	})();
	
	exports['default'] = Expression;
	module.exports = exports['default'];

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _core = __webpack_require__(6);
	
	var _core2 = _interopRequireDefault(_core);
	
	var _map = __webpack_require__(2);
	
	var _map2 = _interopRequireDefault(_map);
	
	var _proxyEvent = __webpack_require__(1);
	
	var _proxyEvent2 = _interopRequireDefault(_proxyEvent);
	
	var ObserverFactory = (function () {
	  function ObserverFactory() {
	    _classCallCheck(this, ObserverFactory);
	
	    this.observers = new _map2['default']();
	  }
	
	  _createClass(ObserverFactory, [{
	    key: '_bind',
	    value: function _bind(observer) {
	      this.observers.set(observer.target, observer);
	    }
	  }, {
	    key: '_unbind',
	    value: function _unbind(observer) {
	      if (this.observers.get(observer.target) === observer) {
	        this.observers['delete'](observer.target);
	      }
	    }
	  }, {
	    key: '_get',
	    value: function _get(target) {
	      return this.observers.get(target);
	    }
	  }, {
	    key: 'hasListen',
	    value: function hasListen(obj) {
	      var target = _proxyEvent2['default'].obj(obj),
	          observer = this._get(target);
	
	      if (!observer) {
	        return false;
	      } else if (arguments.length == 1) {
	        return true;
	      } else {
	        return observer.hasListen.apply(observer, Array.prototype.slice.call(arguments, 1));
	      }
	    }
	  }, {
	    key: 'on',
	    value: function on(obj) {
	      var target = _proxyEvent2['default'].obj(obj),
	          observer = this._get(target);
	
	      if (!observer) {
	        observer = new _core2['default'](target);
	        this._bind(observer);
	      }
	      target = observer.on.apply(observer, Array.prototype.slice.call(arguments, 1));
	      if (!observer.hasListen()) {
	        this._unbind(observer);
	        observer.destroy();
	      }
	      return target;
	    }
	  }, {
	    key: 'un',
	    value: function un(obj) {
	      var target = _proxyEvent2['default'].obj(obj),
	          observer = this._get(target);
	
	      if (observer) {
	        target = observer.un.apply(observer, Array.prototype.slice.call(arguments, 1));
	        if (!observer.hasListen()) {
	          this._unbind(observer);
	          observer.destroy();
	        }
	      }
	      return target;
	    }
	  }]);
	
	  return ObserverFactory;
	})();
	
	exports['default'] = new ObserverFactory();
	module.exports = exports['default'];

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _defineProperty2 = __webpack_require__(7);
	
	var _defineProperty3 = _interopRequireDefault(_defineProperty2);
	
	var _proxyEvent = __webpack_require__(1);
	
	var _proxyEvent2 = _interopRequireDefault(_proxyEvent);
	
	var _util = __webpack_require__(9);
	
	var _util2 = _interopRequireDefault(_util);
	
	var arrayHockMethods = ['push', 'pop', 'shift', 'unshift', 'sort', 'reverse', 'splice'];
	
	var lastTime = undefined;
	window.requestAnimationFrame = window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function requestTimeoutFrame(callback) {
	  var currTime = new Date().getTime(),
	      timeToCall = Math.max(0, 16 - (currTime - lastTime)),
	      reqId = setTimeout(function () {
	    callback(currTime + timeToCall);
	  }, timeToCall);
	  lastTime = currTime + timeToCall;
	  return reqId;
	};
	
	window.cancelAnimationFrame = window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame || function cancelAnimationFrame(reqId) {
	  clearTimeout(reqId);
	};
	
	var Observer = (function () {
	  function Observer(target) {
	    _classCallCheck(this, Observer);
	
	    if (target instanceof Array) {
	      this.isArray = true;
	    } else if (target && typeof target === 'object') {
	      this.isArray = false;
	    } else {
	      throw TypeError('can not observe object[' + typeof target + ']');
	    }
	    this.target = target;
	    this.watchers = {};
	    this.listens = {};
	    this.changeRecords = {};
	    this._notify = this._notify.bind(this);
	    this._onObserveChanged = this._onObserveChanged.bind(this);
	    this._onStateChanged = this._onStateChanged.bind(this);
	  }
	
	  _createClass(Observer, [{
	    key: '_notify',
	    value: function _notify() {
	      var _this = this;
	
	      _util2['default'].eachObj(this.changeRecords, function (oldVal, attr) {
	        var val = _this.target[attr];
	
	        if (!_proxyEvent2['default'].eq(val, oldVal)) {
	          var handlers = _this.listens[attr],
	              i = undefined;
	
	          for (i = 0; i < handlers.length; i++) {
	            handlers[i](attr, val, oldVal, _this.target);
	          }
	        }
	      });
	      this.request_frame = null;
	      this.changeRecords = {};
	    }
	  }, {
	    key: '_addChangeRecord',
	    value: function _addChangeRecord(attr, oldVal) {
	      if (!(attr in this.changeRecords)) {
	        this.changeRecords[attr] = oldVal;
	        if (!this.request_frame) this.request_frame = requestAnimationFrame(this._notify);
	      }
	    }
	  }, {
	    key: '_onStateChanged',
	    value: function _onStateChanged(attr, oldVal) {
	      this._addChangeRecord(attr, oldVal);
	    }
	  }, {
	    key: '_onObserveChanged',
	    value: function _onObserveChanged(changes) {
	      for (var i = 0; i < changes.length; i++) {
	        if (this.listens[changes[i].name]) this._onStateChanged(changes[i].name, changes[i].oldValue);
	      }
	    }
	  }, {
	    key: '_defineProperty',
	    value: function _defineProperty(attr, value) {
	      var _this2 = this;
	
	      this.target = _defineProperty3['default'].defineProperty(this.target, attr, {
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
	      _proxyEvent2['default']._fire(this.target);
	    }
	  }, {
	    key: '_undefineProperty',
	    value: function _undefineProperty(attr, value) {
	      this.target = _defineProperty3['default'].defineProperty(this.target, attr, {
	        enumerable: true,
	        configurable: true,
	        value: value
	      });
	    }
	  }, {
	    key: '_hockArrayLength',
	    value: function _hockArrayLength(method) {
	      var self = this;
	
	      this.target[method] = function () {
	        var len = this.length;
	
	        Array.prototype[method].apply(this, arguments);
	        if (self.target.length !== len) self._onStateChanged('length', len);
	      };
	    }
	  }, {
	    key: '_watch',
	    value: function _watch(attr) {
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
	    }
	  }, {
	    key: '_unwatch',
	    value: function _unwatch(attr) {
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
	    }
	  }, {
	    key: '_addListen',
	    value: function _addListen(attr, handler) {
	      var _handlers = this.listens[attr];
	
	      if (typeof handler !== 'function') {
	        throw TypeError("Invalid Observer Handler", handler);
	      }
	
	      if (!_handlers) _handlers = this.listens[attr] = [];
	
	      _handlers.push(handler);
	
	      this._watch(attr);
	    }
	  }, {
	    key: '_removeListen',
	    value: function _removeListen(attr, handler) {
	      var _handlers = undefined,
	          idx = undefined,
	          i = undefined;
	
	      if (attr in this.listens) {
	        _handlers = this.listens[attr] || [];
	        if (!handler) {
	          _handlers = [];
	        } else if ((idx = _handlers.indexOf(handler)) !== -1) {
	          _handlers.splice(idx, 1);
	        }
	        if (!_handlers.length) {
	          delete this.listens[attr];
	          this._unwatch(attr);
	        }
	      }
	    }
	  }, {
	    key: 'hasListen',
	    value: function hasListen(attr, handler) {
	      if (arguments.length === 0) {
	        return _util2['default'].eachObj(this.listens, function () {
	          return false;
	        }) === false;
	      } else if (arguments.length === 1) {
	        if (typeof attr === 'function') {
	          return _util2['default'].eachObj(this.listens, function (h, a) {
	            return h.indexOf(attr) === -1;
	          }) === false;
	        } else {
	          return !!this.listens[attr];
	        }
	      } else {
	        return this.listens[attr] && this.listens[attr].indexOf(handler) !== -1;
	      }
	    }
	  }, {
	    key: 'on',
	    value: function on(attrs, handler) {
	      var _this3 = this;
	
	      if (arguments.length == 1) {
	        if (typeof attrs === 'function') {
	          if (this.isArray) {
	            for (var i = 0; i < this.target.length; i++) {
	              this._addListen(i + '', attrs);
	            }
	            this._addListen('length', attrs);
	          } else {
	            _util2['default'].eachObj(this.target, function (v, attr) {
	              _this3._addListen(attr, attrs);
	            });
	          }
	        } else if (attrs && typeof attrs === 'object') {
	          _util2['default'].eachObj(attrs, function (h, attr) {
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
	    }
	  }, {
	    key: 'un',
	    value: function un(attrs, handler) {
	      var _this4 = this;
	
	      if (arguments.length == 0) {
	        if (this.isArray) {
	          for (var i = 0; i < this.target.length; i++) {
	            this._removeListen(i + '');
	          }
	          this._removeListen('length');
	        } else {
	          _util2['default'].eachObj(this.target, function (v, attr) {
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
	            _util2['default'].eachObj(this.target, function (v, attr) {
	              _this4._removeListen(attr, attrs);
	            });
	          }
	        } else if (attrs instanceof Array) {
	          for (var i = 0; i < attrs.length; i++) {
	            this._removeListen(attrs[i] + '');
	          }
	        } else if (attrs && typeof attrs === 'object') {
	          _util2['default'].eachObj(attrs, function (h, attr) {
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
	    }
	  }, {
	    key: 'destroy',
	    value: function destroy() {
	      var _this5 = this;
	
	      _util2['default'].eachObj(this.listens, function (h, attr) {
	        _this5._removeListen(attr, h);
	      });
	      if (this.request_frame) {
	        cancelAnimationFrame(this.request_frame);
	        this.request_frame = undefined;
	      }
	      this.target = undefined;
	      this.watchers = undefined;
	      this.listens = undefined;
	      this.changeRecords = undefined;
	    }
	  }]);
	
	  return Observer;
	})();
	
	exports['default'] = Observer;
	module.exports = exports['default'];

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 修复浏览器(IE 6,7,8)对Object.defineProperty的支持，使用VBProxy
	 */
	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	__webpack_require__(8);
	
	function doesDefinePropertyWork(object) {
	  try {
	    var _ret = (function () {
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
	    })();
	
	    if (typeof _ret === 'object') return _ret.v;
	  } catch (exception) {
	    return false;
	  }
	}
	var OBJECT = Object;
	if (!Object.defineProperty || !doesDefinePropertyWork({})) {
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
	}
	exports['default'] = OBJECT;
	module.exports = exports['default'];

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 使用VBScript对象代理js对象的get/set方法, 参考Avalon实现
	 * @see  https://github.com/RubyLouvre/avalon/blob/master/src/08%20modelFactory.shim.js
	 */
	'use strict';
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _map = __webpack_require__(2);
	
	var _map2 = _interopRequireDefault(_map);
	
	var OBJECT_PROTO_PROPS = ['hasOwnProperty', 'toString', 'toLocaleString', 'isPrototypeOf', 'propertyIsEnumerable', 'valueOf'],
	    ARRAY_PROTO_PROPS = ['concat', 'copyWithin', 'entries', 'every', 'fill', 'filter', 'find', 'findIndex', 'forEach', 'indexOf', 'lastIndexOf', 'length', 'map', 'keys', 'join', 'pop', 'push', 'reverse', 'reverseRight', 'some', 'shift', 'slice', 'sort', 'splice', 'toSource', 'unshift'],
	    DESC_BINDING = '__PROXY__',
	    CONST_BINDING = '__VB_CONST__',
	    CONST_SCRIPT = ['\tPublic [' + DESC_BINDING + ']', '\tPublic Default Function [' + CONST_BINDING + '](desc)', '\t\tset [' + DESC_BINDING + '] = desc', '\t\tSet [' + CONST_BINDING + '] = Me', '\tEnd Function'].join('\r\n'),
	    VBClassPool = {},
	    VBProxyLoop = new _map2['default'](),
	    classId = 0,
	    support = undefined;
	
	function isSupported() {
	  if (support === undefined) {
	    if (window.VBArray) {
	      try {
	        window.execScript([// jshint ignore:line
	        'Function parseVB(code)', '\tExecuteGlobal(code)', 'End Function' //转换一段文本为VB代码
	        ].join('\n'), 'VBScript');
	        support = true;
	      } catch (e) {
	        support = false;
	        console.error(e.message, e);
	      }
	    } else {
	      support = false;
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
	
	    var genVBClassPropertyGetterScript = function genVBClassPropertyGetterScript(name, valueScript) {
	      return ['\tPublic Property Get [' + name + ']', '\tOn Error Resume Next', //必须优先使用set语句,否则它会误将数组当字符串返回
	      '\t\tSet[' + name + '] = ' + valueScript, '\tIf Err.Number <> 0 Then', '\t\t[' + name + '] = ' + valueScript, '\tEnd If', '\tOn Error Goto 0', '\tEnd Property'].join('\r\n');
	    };
	
	    var genVBClassPropertySetterScript = function genVBClassPropertySetterScript(name, valueScript) {
	      return ['\tPublic Property Let [' + name + '](val)', '\t\t' + valueScript, '\tEnd Property', '\tPublic Property Set [' + name + '](val)', //setter
	      '\t\t' + valueScript, '\tEnd Property'].join('\r\n');
	    };
	
	    var genVBClassScript = function genVBClassScript(className, properties, accessors) {
	      var buffer = [],
	          i = undefined,
	          name = undefined,
	          added = [];
	
	      buffer.push('Class ' + className, CONST_SCRIPT);
	
	      //添加访问器属性
	      for (i = 0; i < accessors.length; i++) {
	        name = accessors[i];
	        buffer.push(genVBClassPropertySetterScript(name, 'Call [' + DESC_BINDING + '].set(Me, "' + name + '", val)'), genVBClassPropertyGetterScript(name, '[' + DESC_BINDING + '].get(Me, "' + name + '")'));
	        added.push(name);
	      }
	      /*
	      accessors.forEach(name => {
	        buffer.push(
	          genVBClassPropertySetterScript(name, 'Call [' + DESC_BINDING + '].set(Me, "' + name + '", val)'),
	          genVBClassPropertyGetterScript(name, '[' + DESC_BINDING + '].get(Me, "' + name + '")')
	        );
	        added.push(name);
	      });*/
	
	      //添加普通属性,因为VBScript对象不能像JS那样随意增删属性，必须在这里预先定义好
	      for (i = 0; i < properties.length; i++) {
	        name = properties[i];
	        if (added.indexOf(name) == -1) buffer.push('\tPublic [' + name + ']');
	      }
	      /*
	      properties.forEach(name => {
	         if (added.indexOf(name) == -1) {
	           buffer.push('\tPublic [' + name + ']');
	         }
	      });*/
	
	      buffer.push('End Class');
	      return buffer.join('\r\n');
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
	        return attr !== DESC_BINDING && attr !== CONST_BINDING && props.indexOf(attr) == -1;
	      };
	      proxy.__destory__ = function () {
	        if (VBProxyLoop.get(object) === proxy) {
	          VBProxyLoop['delete'](object);
	        }
	      };
	      for (i = 0; i < props.length; i++) {
	        name = props[i];
	        if (typeof proxy[name] === 'undefined') {
	          bind = object[name];
	          if (typeof bind === 'function') {
	            bind = bind.bind(object);
	          }
	          proxy[name] = bind;
	        }
	      }
	      /*
	      props.forEach(name => {
	        if (typeof proxy[name] === 'undefined') {
	          bind = object[name];
	          if (typeof bind === 'function') {
	            bind = bind.bind(object);
	          }
	          proxy[name] = bind;
	        }
	      });*/
	      return proxy;
	    };
	
	    var ObjectDescriptor = (function () {
	      function ObjectDescriptor(object, defines) {
	        _classCallCheck(this, ObjectDescriptor);
	
	        this.object = object;
	        this.defines = defines || {};
	      }
	
	      _createClass(ObjectDescriptor, [{
	        key: 'isAccessor',
	        value: function isAccessor(desc) {
	          return desc.get || desc.set;
	        }
	      }, {
	        key: 'hasAccessor',
	        value: function hasAccessor() {
	          for (var attr in this.defines) {
	            if (this.isAccessor(this.defines[attr])) {
	              return true;
	            }
	          }
	          return false;
	        }
	      }, {
	        key: 'defineProperty',
	        value: function defineProperty(attr, desc) {
	          if (!this.isAccessor(desc)) {
	            delete this.defines[attr];
	          } else {
	            this.defines[attr] = desc;
	            if (desc.get) {
	              this.object[attr] = desc.get();
	            }
	          }
	        }
	      }, {
	        key: 'getPropertyDefine',
	        value: function getPropertyDefine(attr) {
	          return this.defines[attr];
	        }
	      }, {
	        key: 'get',
	        value: function get(instance, attr) {
	          var define = this.defines[attr];
	          if (define && define.get) {
	            return define.get.call(instance);
	          } else {
	            return this.object[attr];
	          }
	        }
	      }, {
	        key: 'set',
	        value: function set(instance, attr, value) {
	          var define = this.defines[attr];
	          if (define && define.set) {
	            define.set.call(instance, value);
	          }
	          this.object[attr] = value;
	        }
	      }]);
	
	      return ObjectDescriptor;
	    })();
	
	    var VBProxy = {
	      isSupport: isSupported,
	      isVBProxy: function isVBProxy(object) {
	        return object && typeof object == 'object' && CONST_BINDING in object;
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
	        return proxy;
	      }
	    };
	    window.VBProxy = VBProxy;
	  })();
	}

/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var lastTime = 0;
	
	exports["default"] = {
	
	  hasProp: function hasProp(obj, prop) {
	    return Object.prototype.hasOwnProperty.call(obj, prop);
	  },
	
	  eachObj: function eachObj(obj, callback) {
	    for (var i in obj) {
	      if (Object.prototype.hasOwnProperty.call(obj, i)) {
	        if (callback(obj[i], i) === false) return false;
	      }
	    }
	  }
	};
	module.exports = exports["default"];

/***/ }
/******/ ])
});
;
//# sourceMappingURL=observer.js.map