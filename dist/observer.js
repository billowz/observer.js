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

	'use strict';
	
	module.exports = __webpack_require__(1).assign({}, __webpack_require__(2), __webpack_require__(3));

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
	    requestFrame = function requestFrame(callback) {
	  if (window.requestAnimationFrame && cfg.useAnimationFrame) {
	    return window.requestAnimationFrame(callback);
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
	
	//处理 VBProxy对象(IE 6,7,8)
	function checkObj(obj) {
	  if (_.isObject(obj) && window.VBProxy && window.VBProxy.isVBProxy(obj)) {
	    obj = window.VBProxy.getVBProxyDesc(obj).object;
	  }
	  return obj;
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
	        var val = _this.target[attr];
	        if (checkObj(val) !== checkObj(oldVal)) {
	          h(attr, _this.target[attr], oldVal, _this.target);
	        }
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
	    var _this3 = this;
	
	    this.target = Object.defineProperty(this.target, attr, {
	      enumerable: true,
	      configurable: true,
	      get: function get() {
	        return value;
	      },
	      set: function set(val) {
	        var oldVal = value;
	        value = val;
	        _this3._onStateChanged(attr, oldVal);
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
	      if (this._es7observe && !this.hasListen()) {
	        Object.unobserve(this.target, this._onObserveChanged);
	        this._es7observe = false;
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
	    var _this4 = this;
	
	    var arg = this._parseBindArg.apply(this, arguments);
	    if (arg.attrs.length && arg.handlers.length) {
	      (function () {
	        var obj = checkObj(_this4.target);
	        _.each(arg.attrs, function (attr) {
	          if (!(attr in obj)) {
	            obj[attr] = undefined;
	          }
	        });
	        _.each(arg.attrs, function (attr) {
	          _this4._addListen(attr, arg.handlers);
	        });
	      })();
	    }
	    return this.target;
	  };
	
	  Observer.prototype.un = function un() {
	    var _this5 = this;
	
	    var arg = this._parseBindArg.apply(this, arguments);
	    if (arg.attrs.length) {
	      _.each(arg.attrs, function (attr) {
	        _this5._removeListen(attr, arg.handlers);
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
	
	function observe(obj) {
	  var target = checkObj(obj),
	      observer = getBindObserver(target),
	      ret = undefined;
	  if (!observer) {
	    observer = new Observer(target);
	  }
	  ret = observer.on.apply(observer, _.slice(arguments, 1));
	  if (!observer.hasListen()) {
	    observer.destory();
	  }
	  return ret;
	}
	
	function unobserve(obj) {
	  var target = checkObj(obj);
	  var observer = getBindObserver(target);
	  if (observer) {
	    var ret = observer.un.apply(observer, _.slice(arguments, 1));
	    if (!observer.hasListen()) {
	      observer.destory();
	    }
	    return ret;
	  }
	}
	
	module.exports = {
	  checkObj: checkObj,
	  observe: observe,
	  unobserve: unobserve,
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

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _ = __webpack_require__(1),
	    observer = __webpack_require__(2),
	    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;
	
	var _watchers = new Map();
	
	function baseToString(val) {
	  return val === undefined || val === null ? '' : val + '';
	}
	
	function toPath(value) {
	  if (!_.isString(value)) {
	    return [];
	  }
	  var result = [];
	  baseToString(value).replace(rePropName, function (match, number, quote, string) {
	    result.push(quote ? string.replace(reEscapeChar, '$1') : number || match);
	  });
	  return result;
	}
	
	var Watcher = (function () {
	  function Watcher(target, expression, path) {
	    _classCallCheck(this, Watcher);
	
	    if (!this.canObserve(target)) {
	      throw new TypeError('Invalid Param');
	    }
	    this.expression = expression;
	    this.handlers = [];
	    this.path = path || toPath(expression);
	    this.observers = [];
	    this._observeHandlers = this._initObserveHandlers();
	    this.target = this._observe(target, 0);
	    _watchers[this.expression] = this;
	  }
	
	  Watcher.prototype.addListen = function addListen(handler) {
	    var _this = this;
	
	    if (_.isArray(handler)) {
	      _.each(handler, function (h) {
	        if (_.isFunction(h) && !_.include(_this.handlers, h)) {
	          _this.handlers.push(h);
	        }
	      });
	    } else if (_.isFunction(handler) && !_.include(this.handlers, handler)) {
	      this.handlers.push(handler);
	    }
	  };
	
	  Watcher.prototype.removeListen = function removeListen(handler) {
	    if (_.isArray(handler)) {
	      _.remove(this.handlers, function (h) {
	        return _.include(handler, h);
	      });
	    } else if (_.isFunction(handler)) {
	      _.remove(this.handlers, handler);
	    } else if (arguments.length == 0) {
	      this.handlers = [];
	    }
	  };
	
	  Watcher.prototype.hasListen = function hasListen() {
	    return !!this.handlers.length;
	  };
	
	  Watcher.prototype.canObserve = function canObserve(obj) {
	    return obj && _.isObject(obj);
	  };
	
	  Watcher.prototype.destory = function destory() {
	    this.target = this._unobserve(this.target, 0);
	  };
	
	  Watcher.prototype._observe = function _observe(obj, idx) {
	    if (idx < this.path.length && this.canObserve(obj)) {
	      var attr = this.path[idx];
	      obj[attr] = this._observe(obj[attr], idx + 1);
	      return observer.observe(obj, attr, this._observeHandlers[idx]);
	    }
	    return obj;
	  };
	
	  Watcher.prototype._unobserve = function _unobserve(obj, idx) {
	    if (idx < this.path.length && this.canObserve(obj)) {
	      var attr = this.path[idx],
	          ret = undefined;
	      ret = observer.unobserve(obj, attr, this._observeHandlers[idx]);
	      ret[attr] = this._unobserve(obj[attr], idx + 1);
	      return ret;
	    }
	    return obj;
	  };
	
	  Watcher.prototype._initObserveHandlers = function _initObserveHandlers() {
	    var _this2 = this;
	
	    return _.map(this.path, function (val, idx) {
	      return _this2._createObserveHandler(idx);
	    });
	  };
	
	  Watcher.prototype._createObserveHandler = function _createObserveHandler(idx) {
	    var _this3 = this;
	
	    var path = _.slice(this.path, 0, idx + 1),
	        rpath = _.slice(this.path, idx + 1),
	        ridx = this.path.length - idx - 1;
	    return function (attr, val, oldVal) {
	      if (ridx > 0) {
	        _this3._unobserve(oldVal, idx + 1);
	        _this3._observe(val, idx + 1);
	        oldVal = _.get(oldVal, rpath);
	        val = _.get(val, rpath);
	      }
	      if (val !== oldVal && _this3.handlers) {
	        _.each(_this3.handlers, function (h) {
	          h(_this3.expression, val, oldVal, _this3.target);
	        });
	      }
	    };
	  };
	
	  return Watcher;
	})();
	
	var watcherLookup = new Map();
	
	function addWatcher(watcher) {
	  var obj = observer.checkObj(watcher.target),
	      map = watcherLookup.get(obj);
	  if (!map) {
	    map = {};
	    watcherLookup.set(obj, map);
	  }
	  map[watcher.expression] = watcher;
	}
	
	function getWatcher(obj, expression) {
	  obj = observer.checkObj(obj);
	  var map = watcherLookup.get(obj);
	  if (map) {
	    return map[expression];
	  }
	  return undefined;
	}
	
	function removeWatcher(watcher) {
	  var obj = observer.checkObj(watcher.target),
	      map = watcherLookup.get(obj);
	  if (map) {
	    delete map[watcher.expression];
	    if (!_.findKey(map)) {
	      watcherLookup['delete'](obj);
	    }
	  }
	}
	
	function doObserve(object, expression, handler, cascade, nonPath, signPath, multipath) {
	  if (expression && _.isArray(expression)) {
	    if (!expression.length) {
	      expression = undefined;
	    } else {
	      var ret = object;
	      _.each(expression, function (exp) {
	        ret = cascade(object, exp, handler);
	      });
	      return ret;
	    }
	  }
	  var path = toPath(expression);
	  if (!path.length) {
	    return nonPath(object, handler);
	  } else if (path.length == 1) {
	    return signPath(object, expression, handler);
	  } else {
	    return multipath(object, expression, handler, path);
	  }
	}
	function observe(object, expression, handler) {
	  var _arguments = arguments;
	
	  if (arguments.length == 2) {
	    handler = expression;
	    expression = undefined;
	  }
	  return doObserve(object, expression, handler, observe, observer.observe, observer.observe, function (object, expression, handler, path) {
	    var watcher = getWatcher(object, expression) || new Watcher(object, expression, path);
	    watcher.addListen.apply(watcher, _.slice(_arguments, 2));
	    if (!watcher.hasListen()) {
	      removeWatcher(watcher);
	      watcher.destory();
	      return object;
	    }
	    return watcher.target;
	  });
	}
	function unobserve(object, expression, handler) {
	  var _arguments2 = arguments;
	
	  if (arguments.length == 2) {
	    handler = expression;
	    expression = undefined;
	  }
	  return doObserve(object, expression, handler, unobserve, observer.unobserve, observer.unobserve, function (object, expression, handler, path) {
	    var watcher = getWatcher(object, expression);
	    if (watcher) {
	      watcher.removeListen.apply(watcher, _.slice(_arguments2, 2));
	      if (!watcher.hasListen()) {
	        removeWatcher(watcher);
	        watcher.destory();
	      }
	      return watcher.target;
	    }
	    return object;
	  });
	}
	
	module.exports = {
	  observe: observe,
	  unobserve: unobserve
	};

/***/ }
/******/ ])
});
;
//# sourceMappingURL=observer.js.map