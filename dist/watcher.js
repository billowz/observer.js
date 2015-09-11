(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("_"));
	else if(typeof define === 'function' && define.amd)
		define(["_"], factory);
	else if(typeof exports === 'object')
		exports["watcher"] = factory(require("_"));
	else
		root["watcher"] = factory(root["_"]);
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

	'use strict';
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _ = __webpack_require__(1),
	    observer = __webpack_require__(2),
	    expressionVars = /[^\[\]\.]+/g;
	
	var Watcher = (function () {
	  function Watcher(target, expression, handler) {
	    _classCallCheck(this, Watcher);
	
	    this.target = target;
	    this.expression = expression;
	    this.handler = handler;
	    this.path = this.parsePath(expression);
	    this.observers = [];
	    this._watchItem(this.target, 0);
	  }
	
	  Watcher.prototype._watchItem = function _watchItem(obj, idx) {
	    if (idx >= this.path.length) {
	      return;
	    }
	    var attr = this.path[idx];
	    if (_.isPlainObject(obj) || _.isArray(obj)) {
	      this._observe(obj, idx);
	      this._watchItem(obj[attr], idx + 1);
	    }
	  };
	
	  Watcher.prototype._observe = function _observe(obj, idx) {
	    var _this = this;
	
	    var handler = function handler(attr, val, oldVal) {
	      if (_.isPlainObject(oldVal) || _.isArray(oldVal)) {
	        _this._unobserve(oldVal, idx++);
	      }
	    };
	    observer.observe(obj, attr, handler);
	  };
	
	  Watcher.prototype._unobserve = function _unobserve(obj, idx) {};
	
	  Watcher.prototype.parsePath = function parsePath(expression) {
	    var path = [],
	        item = undefined;
	    while (item = expressionVars.exec(expression)) {
	      path.push(item);
	    }
	    return path;
	  };
	
	  return Watcher;
	})();
	
	Watcher.observer = observer;
	module.exports = Watcher;

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
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
	    requestTimeoutFrame = function requestTimeoutFrame(callback) {
	  var currTime = new Date().getTime(),
	      timeToCall = Math.max(0, cfg.timeoutFrameInterval - (currTime - lastTime)),
	      reqId = setTimeout(function () {
	    callback(currTime + timeToCall);
	  }, timeToCall);
	  lastTime = currTime + timeToCall;
	  return reqId;
	},
	    requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame,
	    requestFrame = function requestFrame(callback) {
	  if (requestAnimationFrame && cfg.useAnimationFrame) {
	    return requestAnimationFrame(callback);
	  } else {
	    return requestTimeoutFrame(callback);
	  }
	};
	
	var _observers = new Map(),
	    lastTime = 0,
	    cfg = {
	  useES7Observe: true,
	  useAnimationFrame: false,
	  timeoutFrameInterval: 16
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
	      this._addChangeRecord(attr, oldVal);
	    }
	  };
	
	  Observer.prototype._onObserveChanged = function _onObserveChanged(changes) {
	    var _this2 = this;
	
	    _.each(changes, function (change) {
	      _this2._onStateChanged(change.name, change.oldValue);
	    });
	  };
	
	  Observer.prototype._defineProperty = function _defineProperty(attr, value) {
	    this.target = Object.defineProperty(this.target, this.attr, {
	      enumerable: true,
	      configurable: true,
	      get: function get() {
	        return value;
	      },
	      set: function set(val) {
	        if (value !== val) {
	          var oldVal = value;
	          value = val;
	          this._onStateChanged(attr, oldVal);
	        }
	      }
	    });
	  };
	
	  Observer.prototype._undefineProperty = function _undefineProperty(attr, value) {
	    this.target = Object.defineProperty(this.target, this.attr, {
	      enumerable: true,
	      configurable: true,
	      value: value
	    });
	  };
	
	  Observer.prototype._watch = function _watch(attr) {
	    if (Object.observe && cfg.useES7Observe) {
	      if (!this._es7observe) {
	        Object.observe(this.target, this._onObserveChanged);
	        this._es7observe = true;
	      }
	    } else if (!this.watchers[attr]) {
	      this._defineProperty(attr, this.target[attr]);
	      this.watchers[attr] = true;
	    }
	  };
	
	  Observer.prototype._unwatch = function _unwatch(attr) {
	    if (Object.observe && cfg.useES7Observe) {
	      if (this._es7observe && this.hasListen()) {
	        Object.unobserve(this.target, this._onObserveChanged);
	        _es7observe = false;
	      }
	    } else if (this.watchers[attr]) {
	      this._undefineProperty(attr, this.target[attr]);
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
	      (function () {
	        var obj = checkObj(_this3.target);
	        _.each(arg.attrs, function (attr) {
	          if (!(attr in obj)) {
	            obj[attr] = undefined;
	          }
	        });
	        _.each(arg.attrs, function (attr) {
	          _this3._addListen(attr, arg.handlers);
	        });
	      })();
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
	
	function checkObj(obj) {
	  if (window.VBProxy && window.VBProxy.isVBProxy(obj)) {
	    obj = window.VBProxy.getVBProxyDesc(obj).object;
	  }
	  return obj;
	}
	module.exports = {
	  observe: function observe(obj) {
	    // VB Proxy
	    //
	    obj = checkObj(obj);
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
	
	  unobserve: function unobserve(obj) {
	    obj = checkObj(obj);
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
	      var _ret2 = (function () {
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
	
	      if (typeof _ret2 === 'object') return _ret2.v;
	    } catch (exception) {
	      return false;
	    }
	  })())
	};

/***/ }
/******/ ])
});
;
//# sourceMappingURL=watcher.js.map