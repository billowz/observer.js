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
	
	var _expFactory = __webpack_require__(2);
	
	var _expFactory2 = _interopRequireDefault(_expFactory);
	
	_expFactory2['default'].proxy = _proxyEvent2['default'];
	exports['default'] = _expFactory2['default'];
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var ProxyEventFactory = (function () {
	  _createClass(ProxyEventFactory, [{
	    key: 'isEnable',
	    value: function isEnable() {
	      return window.VBProxy;
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
	
	    this.proxyEvents = new Map();
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
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _exp3 = __webpack_require__(3);
	
	var _exp4 = _interopRequireDefault(_exp3);
	
	var _factory = __webpack_require__(4);
	
	var _factory2 = _interopRequireDefault(_factory);
	
	var ExpressionFactory = (function () {
	  function ExpressionFactory() {
	    _classCallCheck(this, ExpressionFactory);
	
	    this.exps = new Map();
	  }
	
	  _createClass(ExpressionFactory, [{
	    key: '_bind',
	    value: function _bind(exp) {
	      var obj = _factory2['default'].obj(exp.target),
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
	      var obj = _factory2['default'].obj(exp.target),
	          map = this.exps.get(obj);
	
	      if (map && map[exp.expression] === exp) {
	        delete map[exp.expression];
	
	        for (var key in map) {
	          return;
	        }
	        this.exps['delete'](obj);
	      }
	    }
	  }, {
	    key: '_get',
	    value: function _get(obj, exp) {
	      var map = undefined;
	
	      obj = _factory2['default'].obj(exp.target);
	      map = this.exps.get(obj);
	      if (map) return map[exp];
	      return undefined;
	    }
	  }, {
	    key: '_on',
	    value: function _on(obj, exp, handler) {
	      var path = toPath(exp);
	
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
	      var path = toPath(exp);
	
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
	    key: 'on',
	    value: function on(obj) {
	      if (arguments.length < 2) {
	        throw TypeError('Invalid Parameter');
	      } else if (arguments.length === 2) {
	        var p1 = arguments[1];
	        if (typeof p1 === 'function') {
	          return _factory2['default'].on(obj, p1);
	        } else if (p1 && typeof p1 === 'object') {
	          for (var exp in p1) {
	            if (typeof p1[exp] !== 'function') {
	              throw TypeError('Invalid Observer Handler');
	            }
	            obj = this._on(obj, exp, p1[exp]);
	          }
	        } else {
	          throw TypeError('Invalid Parameter');
	        }
	      } else if (arguments.length >= 3) {
	        var i = undefined,
	            _exps = [],
	            _handler = undefined;
	
	        for (i = 0; i < arguments.length; i++) {
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
	          obj = this._on(obj, _exps[i] + '', _handler);
	        }
	      }
	      return obj;
	    }
	  }, {
	    key: 'un',
	    value: function un(obj) {
	      if (arguments.length < 1) {
	        throw TypeError('Invalid Parameter');
	      } else if (arguments.length === 1) {
	        return _factory2['default'].un(obj);
	      } else if (arguments.length === 2) {
	        var p1 = arguments[1];
	
	        if (p1 instanceof Array) {
	          for (var i = 0; i < p1.length; i++) {
	            obj = this._on(obj, p1);
	          }
	        } else if (p1 && typeof p1 === 'object') {
	          for (var exp in p1) {
	            obj = this._un(obj, exp, p1[exp]);
	          }
	        } else {
	          obj = this._un(obj, p1 + '');
	        }
	      } else if (arguments.length >= 3) {
	        var i = undefined;
	
	        exps = [];
	        handler = undefined;
	        for (i = 0; i < arguments.length; i++) {
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
	
	ExpressionFactory.prototype.obj = _factory2['default'].obj;
	ExpressionFactory.prototype.eq = _factory2['default'].eq;
	
	exports['default'] = new ExpressionFactory();
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
	
	var _factory = __webpack_require__(4);
	
	var _factory2 = _interopRequireDefault(_factory);
	
	var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;
	
	function baseToString(val) {
	  return val === undefined || val === null ? '' : val + '';
	}
	
	function toPath(value) {
	  var result = [];
	  if (typeof value === 'string') {
	    baseToString(value).replace(rePropName, function (match, number, quote, string) {
	      result.push(quote ? string.replace(reEscapeChar, '$1') : number || match);
	    });
	  }
	  return result;
	}
	
	var Expression = (function () {
	  function Expression(target, expression, path) {
	    _classCallCheck(this, Expression);
	
	    this.expression = expression;
	    this.handlers = [];
	    this.path = path || toPath(expression);
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
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _core = __webpack_require__(5);
	
	var _core2 = _interopRequireDefault(_core);
	
	var ObserverFactory = (function () {
	  function ObserverFactory() {
	    _classCallCheck(this, ObserverFactory);
	
	    this.observers = new Map();
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
	    key: 'on',
	    value: function on(obj) {
	      var target = _core2['default'].obj(obj),
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
	      var target = _core2['default'].obj(obj),
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
	
	ObserverFactory.prototype.obj = _core2['default'].obj;
	ObserverFactory.prototype.eq = _core2['default'].eq;
	
	exports['default'] = new ObserverFactory();
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
	
	var _proxyEvent = __webpack_require__(1);
	
	var _proxyEvent2 = _interopRequireDefault(_proxyEvent);
	
	var arrayHockMethods = ['push', 'pop', 'shift', 'unshift', 'sort', 'reverse', 'splice'];
	
	var Observer = (function () {
	  _createClass(Observer, null, [{
	    key: 'eq',
	    value: function eq(obj, obj2) {
	      return _proxyEvent2['default'].obj(obj) === _proxyEvent2['default'].obj(obj2);
	    }
	  }]);
	
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
	      var attr = undefined,
	          val = undefined,
	          oldVal = undefined,
	          handlers = undefined,
	          i = undefined;
	
	      for (attr in this.changeRecords) {
	        val = this.target[attr];
	        oldVal = this.changeRecords[attr];
	        if (!Observer.eq(val, oldVal)) {
	          handlers = this.listens[attr];
	          for (i = 0; i < handlers.length; i++) {
	            handlers[i](attr, val, oldVal, this.target);
	          }
	        }
	      }
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
	      var _this = this;
	
	      this.target = Object.defineProperty(this.target, attr, {
	        enumerable: true,
	        configurable: true,
	        get: function get() {
	          return value;
	        },
	        set: function set(val) {
	          var oldVal = value;
	          value = val;
	          _this._onStateChanged(attr, oldVal);
	        }
	      });
	      _proxyEvent2['default']._fire(this.target);
	    }
	  }, {
	    key: '_undefineProperty',
	    value: function _undefineProperty(attr, value) {
	      this.target = Object.defineProperty(this.target, this.attr, {
	        enumerable: true,
	        configurable: true,
	        value: value
	      });
	    }
	  }, {
	    key: '_hockArrayLength',
	    value: function _hockArrayLength(method) {
	      var _this2 = this,
	          _arguments = arguments;
	
	      var fn = this.target[method];
	      this.target[method] = function () {
	        var len = _this2.target.length;
	
	        fn.apply(_this2.target, _arguments);
	        if (_this2.target.length !== len) _this2._onStateChanged(attr, len);
	      };
	      return fn;
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
	          this.arrayhocks = [];
	          for (var i = 0; i < arrayHockMethods.length; i++) {
	            this.arrayhocks[i] = this._hockArrayLength(arrayHockMethods[i]);
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
	        if (this._isArray && attr === 'length') {
	          for (var i = 0; i < arrayHockMethods.length; i++) {
	            this.target[method] = this.arrayhocks[i];
	          }
	          this.arrayhocks == [];
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
	    value: function hasListen() {
	      for (var _attr in this.listens) {
	        return true;
	      }
	      return false;
	    }
	  }, {
	    key: 'on',
	    value: function on(attrs, handler) {
	      if (arguments.length == 1) {
	        if (typeof attrs === 'function') {
	          for (var _attr2 in this.target) {
	            this._addListen(_attr2, attrs);
	          }
	        } else if (attrs && typeof attrs === 'object') {
	          for (var _attr3 in attrs) {
	            handler = attrs[_attr3];
	            if (typeof handler !== 'function') {
	              throw TypeError("Invalid Observer Handler", handler);
	            }
	            this._addListen(_attr3, handler);
	          }
	        } else {
	          throw TypeError('Invalid Parameter', arguments);
	        }
	      } else if (arguments.length >= 2) {
	        var i = undefined;
	
	        attrs = [];
	        handler = undefined;
	        for (i = 0; i < arguments.length; i++) {
	          if (typeof arguments[i] === 'function') {
	            handler = arguments[i];
	            break;
	          }
	          if (arguments[i] instanceof Array) {
	            attrs.push.apply(attrs, arguments[i]);
	          } else {
	            attrs.push(arguments[i]);
	          }
	        }
	        if (!handler) {
	          throw TypeError("Invalid Observer Handler", handler);
	        }
	        for (i = 0; i < attrs.length; i++) {
	          this._addListen(attrs[i] + '', handler);
	        }
	      } else {
	        throw TypeError('Invalid Parameter', arguments);
	      }
	      return this.target;
	    }
	  }, {
	    key: 'un',
	    value: function un(attrs, handler) {
	      if (arguments.length == 0) {
	        for (var _attr4 in this.target) {
	          this._removeListen(_attr4);
	        }
	      } else if (arguments.length == 1) {
	        if (attrs instanceof Array) {
	          for (var i = 0; i < attrs.length; i++) {
	            this._removeListen(attrs[i] + '');
	          }
	        } else if (attrs && typeof attrs === 'object') {
	          for (var _attr5 in attrs) {
	            this._removeListen(_attr5, attrs[_attr5]);
	          }
	        } else {
	          this._removeListen(attrs + '');
	        }
	      } else if (arguments.length >= 2) {
	        var i = undefined;
	
	        attrs = [];
	        handler = undefined;
	        for (i = 0; i < arguments.length; i++) {
	          if (typeof arguments[i] === 'function') {
	            handler = arguments[i];
	            break;
	          }
	          if (arguments[i] instanceof Array) {
	            attrs.push.apply(attrs, arguments[i]);
	          } else {
	            attrs.push(arguments[i]);
	          }
	        }
	        for (i = 0; i < attrs.length; i++) {
	          this._removeListen(attrs[i] + '', handler);
	        }
	      } else {
	        throw TypeError('Invalid Parameter', arguments);
	      }
	      return this.target;
	    }
	  }, {
	    key: 'destroy',
	    value: function destroy() {
	      for (var _attr6 in this.listens) {
	        this._removeListen(_attr6);
	      }
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
	
	Observer.obj = _proxyEvent2['default'].obj;
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;
//# sourceMappingURL=observer.js.map