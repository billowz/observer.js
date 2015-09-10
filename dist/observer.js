(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("_"));
	else if(typeof define === 'function' && define.amd)
		define(["_"], factory);
	else if(typeof exports === 'object')
		exports["observer"] = factory(require("_"));
	else
		root["observer"] = factory(root["_"]);
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
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 监控对象属性变化
	 * 高版本浏览器(Chrome 36+, Opera 23+)基于 Object.observe(ES7)实现
	 * 基于浏览器使用 Object.defineProperty实现
	 * IE 6,7,8使用VBScript实现Object.defineProperty
	 */
	'use strict';
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _ = __webpack_require__(1),
	    ARRAY_METHODS = ['push', 'pop', 'shift', 'unshift', 'sort', 'reverse', 'splice'],
	    prefixes = 'webkit moz ms o'.split(' '),
	    getFrame = function getFrame(prop, defaultVal) {
	  var ret = window[prop];
	  if (!ret) {
	    prop = _.capitalize(prop);
	    prop = _.find(prefixes, function (prefix) {
	      return window[prefix + prop];
	    });
	    ret = prop ? window[prop] : null;
	  }
	  return ret || defaultVal;
	},
	    requestFrame = getFrame('requestAnimationFrame', function requestAnimationFrame(callback) {
	  var currTime = new Date().getTime(),
	      timeToCall = Math.max(0, 16 - (currTime - lastTime)),
	      reqId = setTimeout(function () {
	    callback(currTime + timeToCall);
	  }, timeToCall);
	  lastTime = currTime + timeToCall;
	  return reqId;
	}).bind(window);
	
	var _observers = new Map(),
	    lastTime = 0,
	    cfg = {
	  useES7Observe: true
	};
	
	function bindObserver(observer) {
	  if (observer._binded !== true) {
	    _observers.set(observer.target, observer);
	    observer._binded = true;
	  }
	}
	
	function unbindObserver(observer) {
	  if (observer._binded === true) {
	    if (_observers.get(observer.target) === observer) {
	      _observers['delete'](observer.target);
	    }
	    observer._binded = false;
	  }
	}
	
	function getBindObserver(target) {
	  return _observers.get(target);
	}
	
	var State = (function () {
	  function State(target, attr, onChange) {
	    _classCallCheck(this, State);
	
	    this.target = target;
	    this.attr = attr;
	    this.onChange = onChange;
	    this.define = Object.getOwnPropertyDescriptor(target, attr) || {
	      enumerable: true,
	      configurable: true,
	      writable: true,
	      value: target[attr]
	    };
	  }
	
	  State.prototype.getValue = function getValue() {
	    if (this.define.get) {
	      return this.define.get.call(this.target);
	    } else {
	      return this.define.value;
	    }
	  };
	
	  State.prototype.setValue = function setValue(value) {
	    var oldValue = this.getValue();
	    if (value !== oldValue) {
	      if (this.define.set) {
	        this.define.set.call(this.target, value);
	      } else {
	        this.define.value = value;
	      }
	      this.onChange(this.attr, oldValue);
	    }
	  };
	
	  State.prototype.bind = function bind() {
	    if (!this._binded) {
	      var _object = Object.defineProperty(this.target, this.attr, {
	        enumerable: true,
	        configurable: true,
	        get: this.getValue.bind(this),
	        set: this.setValue.bind(this)
	      });
	      this.target = _object;
	      this._binded = true;
	    }
	    return this;
	  };
	
	  State.prototype.unbind = function unbind() {
	    if (this._binded) {
	      this.target = Object.defineProperty(this.target, this.attr, this.define);
	      this._binded = false;
	    }
	    return this;
	  };
	
	  State.prototype.isBinded = function isBinded() {
	    return !!this._binded;
	  };
	
	  return State;
	})();
	
	var Observer = (function () {
	  function Observer(target) {
	    _classCallCheck(this, Observer);
	
	    if (!_.isArray(target) && !_.isObject(target)) {
	      throw TypeError('can not observe object[' + typeof target + ']');
	    }
	    this.target = target;
	    this.watchers = {};
	    this.listens = {};
	    this._onObserveChanged = this._onObserveChanged.bind(this);
	    this._notify = this._notify.bind(this);
	    this.changeRecords = {};
	    bindObserver(this);
	  }
	
	  Observer.prototype._notify = function _notify() {
	    var _this = this;
	
	    _.map(this.changeRecords, function (oldVal, attr) {
	      var handlers = _this.listens[attr];
	      _.each(handlers, function (h) {
	        h(attr, _this.target[attr], oldVal, _this.target);
	      });
	    });
	    this.__request_frame = null;
	    this.changeRecords = {};
	  };
	
	  Observer.prototype._addChangeRecord = function _addChangeRecord(attr, oldVal) {
	    if (!(attr in this.changeRecords)) {
	      this.changeRecords[attr] = oldVal;
	      if (!this.__request_frame) {
	        this.__request_frame = requestFrame(this._notify);
	      }
	    }
	  };
	
	  Observer.prototype._addListen = function _addListen(attr, handlers) {
	    var attrHandlers = this.listens[attr];
	    if (!attrHandlers) {
	      attrHandlers = this.listens[attr] = [];
	    }
	    _.each(handlers, function (h) {
	      if (!_.include(attrHandlers, h)) {
	        attrHandlers.push(h);
	      }
	    });
	    if (attrHandlers.length) {
	      this._watch(attr);
	    }
	  };
	
	  Observer.prototype._removeListen = function _removeListen(attr, handlers) {
	    var attrHandlers = this.listens[attr];
	    if (attrHandlers) {
	      if (handlers.length) {
	        _.remove(attrHandlers, function (h) {
	          return _.include(handlers, h);
	        });
	      }
	      if (!handlers.length || !attrHandlers.length) {
	        delete this.listens[attr];
	        this._unwatch(attr);
	      }
	    }
	  };
	
	  Observer.prototype._onStateChanged = function _onStateChanged(attr, oldVal) {
	    if (attr in this.listens) {
	      console.log('changed:', attr, ' ', oldVal);
	      this._addChangeRecord(attr, oldVal);
	    }
	  };
	
	  Observer.prototype._onObserveChanged = function _onObserveChanged(changes) {
	    var _this2 = this;
	
	    _.each(changes, function (change) {
	      _this2._onStateChanged(change.name, change.oldValue);
	    });
	  };
	
	  Observer.prototype._watch = function _watch(attr) {
	    if (Object.observe && cfg.useES7Observe) {
	      if (!this._es7observe) {
	        Object.observe(this.target, this._onObserveChanged);
	        this._es7observe = true;
	      }
	    } else if (!this.watchers[attr]) {
	      this.watchers[attr] = new State(this.target, attr, this._onStateChanged.bind(this)).bind();
	      this.target = this.watchers[attr].target;
	    }
	  };
	
	  Observer.prototype._unwatch = function _unwatch(attr) {
	    if (Object.observe && cfg.useES7Observe) {
	      if (this._es7observe && this.hasListen()) {
	        Object.unobserve(this.target, this._onObserveChanged);
	        _es7observe = false;
	      }
	    } else if (this.watchers[attr]) {
	      this.watchers[attr].unbind();
	      this.target = this.watchers[attr].target;
	      delete this.watchers[attr];
	    }
	  };
	
	  Observer.prototype._parseBindArg = function _parseBindArg(attrs, handlers) {
	    if (arguments.length == 1) {
	      handlers = attrs;
	      attrs = _.keys(this.target);
	    } else if (!_.isArray(attrs)) {
	      attrs = [attrs + ''];
	    } else {
	      attrs = _.map(attrs, function (attr) {
	        return attr + '';
	      });
	    }
	    if (!_.isArray(handlers)) {
	      handlers = [handlers];
	    }
	    handlers = _.filter(handlers, function (h) {
	      return _.isFunction(h);
	    });
	    return {
	      attrs: attrs,
	      handlers: handlers
	    };
	  };
	
	  Observer.prototype.hasListen = function hasListen() {
	    return _.findKey(this.listens);
	  };
	
	  Observer.prototype.on = function on() {
	    var _this3 = this;
	
	    var arg = this._parseBindArg.apply(this, arguments);
	    if (arg.attrs.length && arg.handlers.length) {
	      _.each(arg.attrs, function (attr) {
	        if (_this3.target.__proxy__) {
	          var obj = _this3.target.__proxy__.object;
	          if (!(attr in obj)) {
	            obj[attr] = undefined;
	          }
	        }
	        _this3._addListen(attr, arg.handlers);
	      });
	    }
	    return this.target;
	  };
	
	  Observer.prototype.un = function un() {
	    var _this4 = this;
	
	    var arg = this._parseBindArg.apply(this, arguments);
	    if (arg.attrs.length) {
	      _.each(arg.attrs, function (attr) {
	        _this4._removeListen(attr, arg.handlers);
	      });
	    }
	    return this.target;
	  };
	
	  Observer.prototype.destory = function destory() {
	    if (Object.observe && cfg.useES7Observe) {
	      Object.unobserve(this.target, this._onObserveChanged);
	      this.listens = {};
	    } else {
	      _.each(this.watchers, function (state) {
	        state.unbind();
	      });
	      this.watchers = {};
	    }
	    unbindObserver(this);
	  };
	
	  return Observer;
	})();
	
	var Expression = (function () {
	  function Expression(target, expression, handler) {
	    _classCallCheck(this, Expression);
	
	    this.target = target;
	    this.expression = expression;
	    this.handler = handler;
	    this.observers = [];
	  }
	
	  Expression.prototype.parsePath = function parsePath() {};
	
	  Expression.prototype.destory = function destory() {};
	
	  return Expression;
	})();
	
	module.exports = {
	  on: function on(obj) {
	    // VB Proxy
	    if (obj.__proxy__) {
	      obj = obj.__proxy__.object;
	    }
	
	    var observer = getBindObserver(obj);
	    if (!observer) {
	      observer = new Observer(obj);
	    }
	    var ret = observer.on.apply(observer, _.slice(arguments, 1));
	    if (!observer.hasListen()) {
	      observer.destory();
	    }
	    return ret;
	  },
	
	  un: function un(obj) {
	    var observer = getBindObserver(obj);
	    if (observer) {
	      var ret = observer.un.apply(observer, _.slice(arguments, 1));
	      if (!observer.hasListen()) {
	        observer.destory();
	      }
	      return ret;
	    }
	  },
	
	  _getObserver: function _getObserver(obj) {
	    return getBindObserver(obj);
	  },
	
	  cfg: cfg,
	
	  support: !!Object.observe || (window.supportDefinePropertyOnObject !== undefined ? window.supportDefinePropertyOnObject : (function () {
	    if (!Object.defineProperty) {
	      return false;
	    }
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
	  })())
	};

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=observer.js.map