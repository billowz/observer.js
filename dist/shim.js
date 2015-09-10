(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
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
	
	__webpack_require__(1);
	__webpack_require__(2);
	__webpack_require__(3);
	__webpack_require__(4);

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';
	
	var i = undefined;
	//Polyfill global objects
	if (!window.WeakMap) {
	  window.WeakMap = createCollection({
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
	
	if (!window.Map) {
	  window.Map = createCollection({
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
	
	if (!window.Set) {
	  window.Set = createCollection({
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
	
	if (!window.WeakSet) {
	  window.WeakSet = createCollection({
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
	
	function each(arr, callback, scope) {
	  if (window._) return window._.each(arr, callback, scope);
	  if (arr.forEach) arr.forEach(callback, scope);else for (var i = 0; i < arr.length; i++) callback.call(scope, arr[i], i);
	}
	function indexOf(arr, val) {
	  if (window._) return window._.indexOf(arr, val);
	  if (arr.indexOf) return arr.indexOf(val);
	  for (var i = 0; i < arr.length; i++) if (arr[i] === val) return i;
	  return -1;
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
	  if (this.add) each(a, this.add, this);
	  //init Map argument like `[[1,2], [{}, 4]]`
	  else each(a, function (a) {
	      this.set(a[0], a[1]);
	    }, this);
	}
	
	/** delete */
	function sharedDelete(key) {
	  if (this.has(key)) {
	    this._keys.splice(i, 1);
	    this._values.splice(i, 1);
	    // update iteration pointers
	    each(this._itp, function (p) {
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
	  if (key != key || key === 0) for (i = list.length; i-- && !is(list[i], key);) {} else i = indexOf(list, key);
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
	        itp.splice(indexOf(itp, p), 1);
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
	
	module.exports = {
	  each: each,
	  indexOf: indexOf,
	  Map: window.Map,
	  Set: window.Set,
	  WeakMap: window.WeakMap,
	  WeakSet: window.WeakSet
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	
	if (!Function.prototype.bind) {
	  Function.prototype.bind = function bind(scope) {
	    if (arguments.length < 2 && scope === undefined) {
	      return this;
	    }
	    var fn = this,
	        args = [],
	        i = undefined;
	    for (i = 1; i < arguments.length; i++) {
	      args.push(arguments[i]);
	    }
	    return function () {
	      var i = undefined,
	          arg = args.concat([]);
	      for (i = 0; i < arguments.length; i++) {
	        arg.push(arguments[i]);
	      }
	      return fn.apply(scope, arg);
	    };
	  };
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

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
	
	window.supportDefinePropertyOnObject = Object.defineProperty && doesDefinePropertyWork({}), window.supportDefinePropertyOnDom = Object.defineProperty && doesDefinePropertyWork(document.createElement('div'));
	if (!window.supportDefinePropertyOnObject) {
	  (function () {
	    var isElement = function isElement(value) {
	      return value !== undefined && typeof HTMLElement !== 'undefined' && value instanceof HTMLElement && value.nodeType === 1;
	    };
	
	    var fixObject = function fixObject(name, fixedFn, domFn) {
	      if (domFn) {
	        Object[name] = function (object) {
	          if (isElement(object)) {
	            return domFn.apply(Object, arguments);
	          } else {
	            return fixedFn.apply(Object, arguments);
	          }
	        };
	      } else {
	        Object[name] = fixedFn;
	      }
	    };
	
	    var isAccessor = function isAccessor(desc) {
	      return 'get' in desc || 'set' in desc;
	    };
	
	    var buildProxy = function buildProxy(proxy, object, appendProps) {
	      var prop = undefined;
	      for (var i = 0; appendProps && i < appendProps.length; i++) {
	        prop = appendProps[i];
	        if (!(prop in object)) {
	          object[prop] = undefined;
	        }
	      }
	      return VBProxy.createVBProxy(proxy || object);
	    };
	
	    var VBProxy = __webpack_require__(4).init();
	    window.supportDefinePropertyOnObject = VBProxy.isSupport();
	
	    fixObject('defineProperty', function (object, prop, desc) {
	      if (isAccessor(desc)) {
	        // use VBProxy
	        if (VBProxy.isSupport()) {
	          var proxy = VBProxy.getVBProxy(object);
	          if (proxy != null) {
	            object = proxy.__proxy__.object;
	          }
	          if (proxy == null || !(prop in proxy)) {
	            proxy = buildProxy(proxy, object, [prop]);
	          }
	          proxy.__proxy__.defineProperty(prop, desc);
	          return proxy;
	        } else {
	          console.error('defineProperty is unSupported on this Browser.');
	          object[prop] = desc.get ? desc.get() : desc.value;
	        }
	      } else {
	        if (VBProxy.isSupport()) {
	          var proxy = VBProxy.getVBProxy(object);
	          if (proxy != null) {
	            object = proxy.__proxy__.object;
	            if (!(prop in proxy)) {
	              proxy = buildProxy(proxy, object, [prop]);
	            }
	            proxy.__proxy__.defineProperty(prop, desc);
	            return proxy;
	          }
	        }
	        object[prop] = desc.value;
	      }
	      return object;
	    }, supportDefinePropertyOnDom ? Object.defineProperty : null);
	    fixObject('defineProperties', function (object, descs) {
	      var prop = undefined,
	          desc = undefined,
	          accessors = {};
	      for (prop in descs) {
	        desc = descs[prop];
	        if ('get' in desc || 'set' in desc) {}
	        props.push(prop);
	      }
	    }, supportDefinePropertyOnDom ? Object.defineProperties : null);
	    fixObject('getOwnPropertyDescriptor', function (object, attr) {
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
	    }, supportDefinePropertyOnDom ? Object.getOwnPropertyDescriptor : null);
	  })();
	}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var coll = __webpack_require__(1);
	
	var VBProxy = {};
	function init() {
	  if (!window.VBArray) {
	    return;
	  }
	  var VBClassPool = {},
	      IDGen = 0,
	      VBClassNormalScript = ['\tPublic [__proxy__]', '\tPublic Default Function [__vbconst__](desc)', '\t\tset [__proxy__] = desc', '\t\tSet [__vbconst__] = Me', //链式调用
	  '\tEnd Function'].join('\r\n'),
	      util = {
	    genClassName: function genClassName() {
	      return 'VBClass' + IDGen++;
	    },
	    parseVBClassFactoryName: function parseVBClassFactoryName(className) {
	      return className + 'Factory';
	    },
	    genVBClassPropertyGetterScript: function genVBClassPropertyGetterScript(name, valueScript) {
	      return ['\tPublic Property Get [' + name + ']', //getter
	      '\tOn Error Resume Next', //必须优先使用set语句,否则它会误将数组当字符串返回
	      '\t\tSet[' + name + '] = ' + valueScript, '\tIf Err.Number <> 0 Then', '\t\t[' + name + '] = ' + valueScript, '\tEnd If', '\tOn Error Goto 0', '\tEnd Property'].join('\r\n');
	    },
	    genVBClassPropertySetterScript: function genVBClassPropertySetterScript(name, valueScript) {
	      return ['\tPublic Property Let [' + name + '](val)', '\t\t' + valueScript, '\tEnd Property', '\tPublic Property Set [' + name + '](val)', //setter
	      '\t\t' + valueScript, '\tEnd Property'].join('\r\n');
	    },
	    genVBClassScript: function genVBClassScript(className, properties, accessors) {
	      var buffer = [],
	          i = undefined,
	          j = undefined,
	          name = undefined,
	          added = [];
	
	      buffer.push('Class ' + className, VBClassNormalScript);
	
	      //添加访问器属性
	      for (i = 0; i < accessors.length; i++) {
	        name = accessors[i];
	        added.push(name);
	        buffer.push(util.genVBClassPropertySetterScript(name, 'Call [__proxy__].set(Me, "' + name + '", val)'), util.genVBClassPropertyGetterScript(name, '[__proxy__].get(Me, "' + name + '")'));
	      }
	      //添加普通属性,因为VBScript对象不能像JS那样随意增删属性，必须在这里预先定义好
	      for (i = 0; i < properties.length; i++) {
	        name = properties[i];
	        if (coll.indexOf(added, name) == -1) {
	          buffer.push('\tPublic [' + name + ']');
	        }
	      }
	
	      buffer.push('End Class');
	      return buffer.join('\r\n');
	    },
	    getVBClass: function getVBClass(properties, accessors) {
	      var buffer = [],
	          className = undefined,
	          factoryName = undefined,
	          key = '[' + properties.join(',') + ']&&[' + accessors.join(',') + ']';
	      className = VBClassPool[key];
	      if (className) {
	        return util.parseVBClassFactoryName(className);
	      } else {
	        className = util.genClassName();
	        factoryName = util.parseVBClassFactoryName(className);
	        window.parseVB(util.genVBClassScript(className, properties, accessors));
	        window.parseVB(['Function ' + factoryName + '(desc)', //创建实例并传入两个关键的参数
	        '\tDim o', '\tSet o = (New ' + className + ')(desc)', '\tSet ' + factoryName + ' = o', 'End Function'].join('\r\n'));
	        VBClassPool[key] = className;
	        return factoryName;
	      }
	    }
	  },
	      VBProxyLoop = new Map(),
	      ObjectProtoProps = ['hasOwnProperty', 'toString', 'toLocaleString', 'isPrototypeOf', 'propertyIsEnumerable', 'valueOf'],
	      FuncProtoProps = ['apply', 'call', 'constructor', 'prototype', 'name', 'bind'],
	      ArrayProtoProps = ['concat', 'copyWithin', 'entries', 'every', 'fill', 'filter', 'find', 'findIndex', 'forEach', 'indexOf', 'lastIndexOf', 'length', 'map', 'keys', 'join', 'pop', 'push', 'reverse', 'reverseRight', 'some', 'shift', 'slice', 'sort', 'splice', 'toSource', 'unshift'];
	
	  function isVBProxy(object) {
	    return '__vbconst__' in object;
	  }
	
	  function getVBProxy(object) {
	    if (isVBProxy(object)) {
	      object = object.__proxy__.object;
	    }
	    return VBProxyLoop.get(object);
	  }
	  function _createVBProxy(object, defines) {
	    var desc = new ObjectDescriptor(object, defines),
	        accessors = [],
	        props = [],
	        i = undefined,
	        bind = undefined;
	    for (name in object) {
	      accessors.push(name);
	    }
	    props = props.concat(ObjectProtoProps);
	    if (typeof object === 'function') {
	      props = props.concat(FuncProtoProps);
	    }
	    if (Object.prototype.toString.call(object) === '[object Array]') {
	      props = props.concat(ArrayProtoProps);
	    }
	
	    proxy = window[util.getVBClass(props, accessors)](desc);
	    desc._setProxy(proxy);
	
	    proxy['hasOwnProperty'] = function hasOwnProperty(attr) {
	      if (attr === '__proxy__' || attr === '__vbconst__' || coll.indexOf(props, attr) != -1) {
	        return false;
	      }
	      return true;
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
	    return proxy;
	  }
	  function createVBProxy(object) {
	    var proxy = getVBProxy(object),
	        rebuild = false,
	        name = undefined,
	        defines = undefined;
	    if (proxy != null) {
	      object = proxy.__proxy__.object;
	      for (var _name in object) {
	        if (!(_name in proxy)) {
	          rebuild = true;
	          break;
	        }
	      }
	      if (!rebuild) {
	        return proxy;
	      }
	      defines = proxy.__proxy__.defines;
	      proxy.__proxy__.destory();
	    }
	    proxy = _createVBProxy(object, defines);
	    VBProxyLoop.set(object, proxy);
	    return proxy;
	  }
	
	  var ObjectDescriptor = (function () {
	    function ObjectDescriptor(object, defines) {
	      _classCallCheck(this, ObjectDescriptor);
	
	      this.object = object;
	      this.defines = defines || {};
	    }
	
	    ObjectDescriptor.prototype._setProxy = function _setProxy(proxy) {
	      this._proxy = proxy;
	    };
	
	    ObjectDescriptor.prototype.isDestoried = function isDestoried() {
	      return !this._proxy;
	    };
	
	    ObjectDescriptor.prototype.destory = function destory() {
	      if (this._proxy) {
	        var pro = VBProxyLoop.get(this.object);
	        if (pro && pro === proxy) {
	          VBProxyLoop['delete'](this.object);
	        }
	        this._proxy = null;
	      }
	    };
	
	    ObjectDescriptor.prototype.defineProperty = function defineProperty(attr, desc) {
	      this.defines[attr] = desc;
	      if (!desc.get && !desc.set) {
	        this.object[attr] = desc.value;
	      } else {
	        if (typeof desc.get !== 'function') {
	          delete desc.get;
	          this.object[attr] = desc.value;
	        } else {
	          this.object[attr] = desc.get();
	        }
	        if (typeof desc.set !== 'function') {
	          delete desc.set;
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
	  })();
	
	  function fixPrototypeProp(Type, name) {
	    var fn = Type.prototype[name];
	    if (typeof fn === 'function') {
	      Type.prototype[name] = function () {
	        if (isVBProxy(this)) {
	          return fn.apply(this.__proxy__.object, arguments);
	        }
	        return fn.apply(this, arguments);
	      };
	    }
	  }
	
	  function fixPrototypeProps(Type, props) {
	    for (var i = 0; i < props.length; i++) {
	      fixPrototypeProp(Type, props[i]);
	    }
	  }
	
	  fixPrototypeProps(Object, ObjectProtoProps);
	
	  fixPrototypeProps(Array, ArrayProtoProps);
	
	  window.execScript([// jshint ignore:line
	  'Function parseVB(code)', '\tExecuteGlobal(code)', 'End Function' //转换一段文本为VB代码
	  ].join('\n'), 'VBScript');
	
	  VBProxy.isVBProxy = isVBProxy;
	  VBProxy.createVBProxy = createVBProxy;
	  VBProxy.getVBProxy = getVBProxy;
	  VBProxy.__support = true;
	}
	
	VBProxy.isSupport = function () {
	  return VBProxy.init().__support;
	};
	
	VBProxy.init = function () {
	  if (typeof VBProxy.__support === 'undefined') {
	    try {
	      init();
	      if (typeof VBProxy.__support === 'undefined') {
	        VBProxy.__support = false;
	      }
	    } catch (e) {
	      console.error(e.message, e);
	      VBProxy.__support = false;
	    }
	  }
	  return VBProxy;
	};
	window.VBProxy = VBProxy;
	module.exports = VBProxy;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=shim.js.map