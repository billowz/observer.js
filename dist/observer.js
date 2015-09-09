(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("_"));
	else if(typeof define === 'function' && define.amd)
		define(["_"], factory);
	else if(typeof exports === 'object')
		exports["observer"] = factory(require("_"));
	else
		root["observer"] = factory(root["_"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_3__) {
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
	
	__webpack_require__(1);
	module.exports = __webpack_require__(7);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(2);
	__webpack_require__(4);
	__webpack_require__(5);
	__webpack_require__(6);

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(3);
	var i = undefined,
	    shims = {};
	//Polyfill global objects
	if (typeof WeakMap == 'undefined') {
	  shims.WeakMap = createCollection({
	    // WeakMap#delete(key:void*):boolean
	    'delete': sharedDelete,
	    // WeakMap#clear():
	    clear: sharedClear,
	    // WeakMap#get(key:void*):void*
	    get: sharedGet,
	    // WeakMap#has(key:void*):boolean
	    has: mapHas,
	    // WeakMap#set(key:void*, value:void*):void
	    set: sharedSet
	  }, true);
	}
	
	if (typeof Map == 'undefined' || !_.isFunction(new Map().values) || !new Map().values().next) {
	  shims.Map = createCollection({
	    // WeakMap#delete(key:void*):boolean
	    'delete': sharedDelete,
	    //:was Map#get(key:void*[, d3fault:void*]):void*
	    // Map#has(key:void*):boolean
	    has: mapHas,
	    // Map#get(key:void*):boolean
	    get: sharedGet,
	    // Map#set(key:void*, value:void*):void
	    set: sharedSet,
	    // Map#keys(void):Iterator
	    keys: sharedKeys,
	    // Map#values(void):Iterator
	    values: sharedValues,
	    // Map#entries(void):Iterator
	    entries: mapEntries,
	    // Map#forEach(callback:Function, context:void*):void ==> callback.call(context, key, value, mapObject) === not in specs`
	    forEach: sharedForEach,
	    // Map#clear():
	    clear: sharedClear
	  });
	}
	
	if (typeof Set == 'undefined' || !_.isFunction(new Set().values) || !new Set().values().next) {
	  shims.Set = createCollection({
	    // Set#has(value:void*):boolean
	    has: setHas,
	    // Set#add(value:void*):boolean
	    add: sharedAdd,
	    // Set#delete(key:void*):boolean
	    'delete': sharedDelete,
	    // Set#clear():
	    clear: sharedClear,
	    // Set#keys(void):Iterator
	    keys: sharedValues, // specs actually say "the same function object as the initial value of the values property"
	    // Set#values(void):Iterator
	    values: sharedValues,
	    // Set#entries(void):Iterator
	    entries: setEntries,
	    // Set#forEach(callback:Function, context:void*):void ==> callback.call(context, value, index) === not in specs
	    forEach: sharedForEach
	  });
	}
	
	if (typeof WeakSet == 'undefined') {
	  shims.WeakSet = createCollection({
	    // WeakSet#delete(key:void*):boolean
	    'delete': sharedDelete,
	    // WeakSet#add(value:void*):boolean
	    add: sharedAdd,
	    // WeakSet#clear():
	    clear: sharedClear,
	    // WeakSet#has(value:void*):boolean
	    has: setHas
	  }, true);
	}
	
	/**
	 * ES6 collection constructor
	 * @return {Function} a collection class
	 */
	function createCollection(proto, objectOnly) {
	  function Collection(a) {
	    if (!this || this.constructor !== Collection) return new Collection(a);
	    this._keys = [];
	    this._values = [];
	    this._itp = []; // iteration pointers
	    this.objectOnly = objectOnly;
	
	    //parse initial iterable argument passed
	    if (a) init.call(this, a);
	  }
	
	  //define size for non object-only collections
	  if (!objectOnly) {
	    proto.size = sharedSize;
	  }
	
	  //set prototype
	  proto.constructor = Collection;
	  Collection.prototype = proto;
	
	  return Collection;
	}
	
	/** parse initial iterable argument passed */
	function init(a) {
	  var i;
	  //init Set argument, like `[1,2,3,{}]`
	  if (this.add) a.forEach(this.add, this);
	  //init Map argument like `[[1,2], [{}, 4]]`
	  else a.forEach(function (a) {
	      this.set(a[0], a[1]);
	    }, this);
	}
	
	/** delete */
	function sharedDelete(key) {
	  if (this.has(key)) {
	    this._keys.splice(i, 1);
	    this._values.splice(i, 1);
	    // update iteration pointers
	    this._itp.forEach(function (p) {
	      if (i < p[0]) p[0]--;
	    });
	  }
	  // Aurora here does it while Canary doesn't
	  return -1 < i;
	}
	;
	
	function sharedGet(key) {
	  return this.has(key) ? this._values[i] : undefined;
	}
	
	function has(list, key) {
	  if (this.objectOnly && key !== Object(key)) throw new TypeError("Invalid value used as weak collection key");
	  //NaN or 0 passed
	  if (key != key || key === 0) for (i = list.length; i-- && !is(list[i], key);) {} else i = _.indexOf(list, key);
	  return -1 < i;
	}
	
	function setHas(value) {
	  return has.call(this, this._values, value);
	}
	
	function mapHas(value) {
	  return has.call(this, this._keys, value);
	}
	
	/** @chainable */
	function sharedSet(key, value) {
	  this.has(key) ? this._values[i] = value : this._values[this._keys.push(key) - 1] = value;
	  return this;
	}
	
	/** @chainable */
	function sharedAdd(value) {
	  if (!this.has(value)) this._values.push(value);
	  return this;
	}
	
	function sharedClear() {
	  (this._keys || 0).length = this._values.length = 0;
	}
	
	/** keys, values, and iterate related methods */
	function sharedKeys() {
	  return sharedIterator(this._itp, this._keys);
	}
	
	function sharedValues() {
	  return sharedIterator(this._itp, this._values);
	}
	
	function mapEntries() {
	  return sharedIterator(this._itp, this._keys, this._values);
	}
	
	function setEntries() {
	  return sharedIterator(this._itp, this._values, this._values);
	}
	
	function sharedIterator(itp, array, array2) {
	  var p = [0],
	      done = false;
	  itp.push(p);
	  return {
	    next: function next() {
	      var v,
	          k = p[0];
	      if (!done && k < array.length) {
	        v = array2 ? [array[k], array2[k]] : array[k];
	        p[0]++;
	      } else {
	        done = true;
	        itp.splice(_.indexOf(itp, p), 1);
	      }
	      return {
	        done: done,
	        value: v
	      };
	    }
	  };
	}
	
	function sharedSize() {
	  return this._values.length;
	}
	
	function sharedForEach(callback, context) {
	  var it = this.entries();
	  for (;;) {
	    var r = it.next();
	    if (r.done) break;
	    callback.call(context, r.value[1], r.value[0], this);
	  }
	}
	
	_.assign(window, shims);
	module.exports = shims;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(3);
	var shims = {},
	    protoShims = {};
	if (!Function.prototype.bind) {
	  protoShims.bind = function bind(scope) {
	    if (arguments.length < 2 && scope === undefined) {
	      return this;
	    }
	    var fn = this,
	        args = _.slice(arguments, 1);
	    return function () {
	      return fn.apply(scope, args.push.apply(args, arguments));
	    };
	  };
	}
	_.assign(Function.prototype, protoShims);
	module.exports = _.assign(shims, protoShims);

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';
	
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
	var supportDefinePropertyOnObject = Object.defineProperty && doesDefinePropertyWork({});
	var supportDefinePropertyOnDom = Object.defineProperty && doesDefinePropertyWork(document.createElement('div'));
	if (!supportDefinePropertyOnObject) {
	  var fixObject = function fixObject(name, fixedFn, domFn) {
	    if (domFn) {
	      Object[name] = function (object) {
	        if (_.isElement(object)) {
	          domFn.apply(Object, arguments);
	        } else {
	          fixedFn.apply(Object, arguments);
	        }
	      };
	    } else {
	      Object[name] = fixedFn;
	    }
	  };
	
	  fixObject('defineProperty', function (object, prop, desc) {
	    if ('value' in desc) {
	      object[prop] = desc.value;
	    } else if ('get' in desc || 'set' in desc) {
	      if (desc.get) {
	        if (Object.prototype.__defineGetter__) {
	          Object.prototype.__defineGetter__.call(o, prop, desc.get);
	        }
	      }
	      if (desc.set) {
	        if (Object.prototype.__defineSetter__) {
	          Object.prototype.__defineSetter__.call(o, prop, desc.set);
	        }
	      }
	    }
	  }, supportDefinePropertyOnDom ? Object.defineProperty : null);
	
	  fixObject('defineProperties', function () {}, supportDefinePropertyOnDom ? Object.defineProperties : null);
	  fixObject('getOwnPropertyDescriptor', function (object, attr) {
	    console.log('getOwnPropertyDescriptor', arguments);
	  }, supportDefinePropertyOnDom ? Object.getOwnPropertyDescriptor : null);
	}

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	if (window.VBArray) {
	  (function () {
	    var genClassName = function genClassName() {
	      return 'VBClass' + IDGen++;
	    };
	
	    var parseVBClassFactoryName = function parseVBClassFactoryName(className) {
	      return className + 'Factory';
	    };
	
	    var genVBClassPropertyGetterScript = function genVBClassPropertyGetterScript(name, valueScript) {
	      return ['\tPublic Property Get [' + name + ']', //getter
	      '\tOn Error Resume Next', //必须优先使用set语句,否则它会误将数组当字符串返回
	      '\t\tSet[' + name + '] = ' + valueScript, '\tIf Err.Number <> 0 Then', '\t\t[' + name + '] = ' + valueScript, '\tEnd If', '\tOn Error Goto 0', '\tEnd Property'].join('\r\n');
	    };
	
	    var genVBClassPropertySetterScript = function genVBClassPropertySetterScript(name, valueScript) {
	      return ['\tPublic Property Let [' + name + '](val)', '\t\t' + valueScript, '\tEnd Property', '\tPublic Property Set [' + name + '](val)', //setter
	      '\t\t' + valueScript, '\tEnd Property'].join('\r\n');
	    };
	
	    var genVBClassScript = function genVBClassScript(className, properties, accessors) {
	      var buffer = [];
	      buffer.push('Class ' + className, VBClassNormalScript);
	
	      //添加普通属性,因为VBScript对象不能像JS那样随意增删属性，必须在这里预先定义好
	      _.each(properties, function (name) {
	        buffer.push("\tPublic [' + name + ']");
	      });
	
	      //添加访问器属性
	      _.each(accessors, function (name) {
	        buffer.push(genVBClassPropertySetterScript(name, 'Call [__proxy__].set(Me, "' + name + '", val)'), genVBClassPropertyGetterScript(name, '[__proxy__].get(Me, "' + name + '")'));
	      });
	
	      buffer.push('End Class');
	      return buffer.join('\r\n');
	    }
	
	    /**
	     * 动态创建VB Class
	     * @param  Array properties 基本属性
	     * @param  Array accessors  访问器属性(get, set)
	     * @return VB Class         ${className}Factory(data, proxy)
	     */
	    ;
	
	    var getVBClass = function getVBClass(properties, accessors) {
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
	
	    var genVBProxy = function genVBProxy(object) {
	      var proxy = VBProxyLoop.get(object);
	      if (proxy == null) {
	        var desc = new ObjectDescriptor(object),
	            accessors = _.keys(object),
	            props = [],
	            factoryName = getVBClass(props, accessors);
	        proxy = window[factoryName](desc);
	      }
	      return proxy;
	    };
	
	    __webpack_require__(2);
	
	    var VBClassPool = {},
	        IDGen = 0;
	
	    window.execScript([// jshint ignore:line
	    'Function parseVB(code)', '\tExecuteGlobal(code)', 'End Function' //转换一段文本为VB代码
	    ].join('\n'), 'VBScript');
	
	    var VBClassNormalScript = ['\tPrivate [__proxy__]', '\tPublic Default Function [__const__](desc)', '\t\tset [__proxy__] = desc', '\t\tSet [__const__] = Me', //链式调用
	    '\tEnd Function'].join('\r\n'),
	        VBClassProxyPropertyScript = genVBClassPropertyGetterScript('__proxy__', '[__proxy__]');
	
	    var ObjectDescriptor = (function () {
	      function ObjectDescriptor(object) {
	        _classCallCheck(this, ObjectDescriptor);
	
	        this.object = object;
	      }
	
	      ObjectDescriptor.prototype.defineProperty = function defineProperty(attr, desc) {
	        this.defines[attr] = desc;
	      };
	
	      ObjectDescriptor.prototype.get = function get(instance, prop) {
	        console.log('--->get property ' + prop);
	      };
	
	      ObjectDescriptor.prototype.set = function set(instance, prop, value) {
	        this.object[prop] = value;
	        console.log('--->set property ' + prop + '=' + value + ' ' + this.object.a);
	      };
	
	      return ObjectDescriptor;
	    })();
	
	    var VBProxyLoop = new Map();
	
	    window.genVBProxy = genVBProxy;
	    window.VBClassPool = VBClassPool;
	    window.VBProxyLoop = VBProxyLoop;
	  })();
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _ = __webpack_require__(3),
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
	      Object.defineProperty(this.target, this.attr, {
	        enumerable: true,
	        configurable: true,
	        get: this.getValue.bind(this),
	        set: this.setValue.bind(this)
	      });
	      this._binded = true;
	    }
	    return this;
	  };
	
	  State.prototype.unbind = function unbind() {
	    if (this._binded) {
	      Object.defineProperty(this.target, this.attr, this.define);
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
	
	  Observer.prototype._watch = function _watch(attr) {
	    if (Object.observe && cfg.useES7Observe) {
	      if (!this._es7observe) {
	        Object.observe(this.target, this._onObserveChanged);
	        this._es7observe = true;
	      }
	    } else if (!this.watchers[attr]) {
	      this.watchers[attr] = new State(this.target, attr, this._onStateChanged.bind(this)).bind();
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
	    if (!arg.attrs.length || !arg.handlers.length) {
	      return;
	    }
	    _.each(arg.attrs, function (attr) {
	      _this3._addListen(attr, arg.handlers);
	    });
	  };
	
	  Observer.prototype.un = function un() {
	    var _this4 = this;
	
	    var arg = this._parseBindArg.apply(this, arguments);
	    if (!arg.attrs.length) {
	      return;
	    }
	    _.each(arg.attrs, function (attr) {
	      _this4._removeListen(attr, arg.handlers);
	    });
	    return this;
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
	
	module.exports = {
	  on: function on(obj) {
	    var observer = getBindObserver(obj);
	    if (!observer) {
	      observer = new Observer(obj);
	    }
	    observer.on.apply(observer, _.slice(arguments, 1));
	    if (!observer.hasListen()) {
	      observer.destory();
	    }
	  },
	  un: function un(obj) {
	    var observer = getBindObserver(obj);
	    if (observer) {
	      observer.un.apply(observer, _.slice(arguments, 1));
	      if (!observer.hasListen()) {
	        observer.destory();
	      }
	    }
	  },
	  getObserver: function getObserver(obj) {
	    return getBindObserver(obj);
	  },
	  cfg: cfg
	};

/***/ }
/******/ ])
});
;
//# sourceMappingURL=observer.js.map