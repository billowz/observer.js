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
	
	function fixFn(Type, name, _name) {
	  if (!Type[name]) {
	    Type[name] = typeof _name === 'function' ? _name : function () {
	      return _[_name || name].apply(_, arguments);
	    };
	  }
	}
	function fixProtoFn(Type, name, _name) {
	  Type = Type.prototype;
	  if (!Type[name]) {
	    Type[name] = typeof _name === 'function' ? _name : function () {
	      return _[_name || name].apply(_, [this].concat(_.slice(arguments)));
	    };
	  }
	}
	
	fixFn(Object, 'create');
	
	fixProtoFn(Function, 'bind');
	
	fixProtoFn(Array, 'forEach', 'each');
	
	fixProtoFn(Array, 'indexOf');

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Map & Set & WeakMap & WeakSet
	 */
	'use strict';
	
	__webpack_require__(1);
	
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
	  if (key != key || key === 0) for (i = list.length; i-- && !is(list[i], key);) {} else i = list.indexOf(key);
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
	        itp.splice(itp.indexOf(p), 1);
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
	  Map: window.Map,
	  Set: window.Set,
	  WeakMap: window.WeakMap,
	  WeakSet: window.WeakSet
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 使用VBScript对象代理js对象的get/set方法, 参考Avalon实现
	 * @see  https://github.com/RubyLouvre/avalon/blob/master/src/08%20modelFactory.shim.js
	 */
	'use strict';
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var coll = __webpack_require__(2);
	
	var OBJECT_PROTO_PROPS = ['hasOwnProperty', 'toString', 'toLocaleString', 'isPrototypeOf', 'propertyIsEnumerable', 'valueOf'],
	    ARRAY_PROTO_PROPS = ['concat', 'copyWithin', 'entries', 'every', 'fill', 'filter', 'find', 'findIndex', 'forEach', 'indexOf', 'lastIndexOf', 'length', 'map', 'keys', 'join', 'pop', 'push', 'reverse', 'reverseRight', 'some', 'shift', 'slice', 'sort', 'splice', 'toSource', 'unshift'],
	    DESC_BINDING = '__PROXY__',
	    CONST_BINDING = '__VB_CONST__',
	    CONST_SCRIPT = ['\tPublic [' + DESC_BINDING + ']', '\tPublic Default Function [' + CONST_BINDING + '](desc)', '\t\tset [' + DESC_BINDING + '] = desc', '\t\tSet [' + CONST_BINDING + '] = Me', '\tEnd Function'].join('\r\n'),
	    VBClassPool = {},
	    VBProxyLoop = new Map(),
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
	
	function genClassName() {
	  return 'VBClass' + classId++;
	}
	
	function parseVBClassFactoryName(className) {
	  return className + 'Factory';
	}
	
	function genVBClassPropertyGetterScript(name, valueScript) {
	  return ['\tPublic Property Get [' + name + ']', '\tOn Error Resume Next', //必须优先使用set语句,否则它会误将数组当字符串返回
	  '\t\tSet[' + name + '] = ' + valueScript, '\tIf Err.Number <> 0 Then', '\t\t[' + name + '] = ' + valueScript, '\tEnd If', '\tOn Error Goto 0', '\tEnd Property'].join('\r\n');
	}
	
	function genVBClassPropertySetterScript(name, valueScript) {
	  return ['\tPublic Property Let [' + name + '](val)', '\t\t' + valueScript, '\tEnd Property', '\tPublic Property Set [' + name + '](val)', //setter
	  '\t\t' + valueScript, '\tEnd Property'].join('\r\n');
	}
	
	function genVBClassScript(className, properties, accessors) {
	  var buffer = [],
	      i = undefined,
	      j = undefined,
	      name = undefined,
	      added = [];
	
	  buffer.push('Class ' + className, CONST_SCRIPT);
	
	  //添加访问器属性
	  accessors.forEach(function (name) {
	    buffer.push(genVBClassPropertySetterScript(name, 'Call [' + DESC_BINDING + '].set(Me, "' + name + '", val)'), genVBClassPropertyGetterScript(name, '[' + DESC_BINDING + '].get(Me, "' + name + '")'));
	    added.push(name);
	  });
	  //添加普通属性,因为VBScript对象不能像JS那样随意增删属性，必须在这里预先定义好
	  properties.forEach(function (name) {
	    if (added.indexOf(name) == -1) {
	      buffer.push('\tPublic [' + name + ']');
	    }
	  });
	
	  buffer.push('End Class');
	  return buffer.join('\r\n');
	}
	function genVBClass(properties, accessors) {
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
	}
	
	var ObjectDescriptor = (function () {
	  function ObjectDescriptor(object, defines) {
	    _classCallCheck(this, ObjectDescriptor);
	
	    this.object = object;
	    this.defines = defines || {};
	  }
	
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
	
	function _createVBProxy(object, desc) {
	  var accessors = [],
	      props = [],
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
	    return attr !== DESC_BINDING && attr !== CONST_BINDING && coll.indexOf(props, attr) == -1;
	  };
	
	  props.forEach(function (name) {
	    if (typeof proxy[name] === 'undefined') {
	      bind = object[name];
	      if (typeof bind === 'function') {
	        bind = bind.bind(object);
	      }
	      proxy[name] = bind;
	    }
	  });
	  return proxy;
	}
	
	var VBProxy = {
	  isSupport: isSupported,
	  isVBProxy: function isVBProxy(object) {
	    return CONST_BINDING in object;
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
	
	function fixPrototypeProp(Type, name) {
	  var fn = Type.prototype[name];
	  if (typeof fn === 'function') {
	    Type.prototype[name] = function () {
	      if (VBProxy.isVBProxy(this)) {
	        return fn.apply(this[DESC_BINDING].object, arguments);
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
	
	fixPrototypeProps(Object, OBJECT_PROTO_PROPS);
	fixPrototypeProps(Array, ARRAY_PROTO_PROPS);
	
	window.VBProxy = VBProxy;
	module.exports = VBProxy;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 修复浏览器(IE 6,7,8)对Object.defineProperty的支持，使用VBProxy
	 */
	
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
	    var VBProxy = __webpack_require__(3);
	    if (VBProxy.isSupport()) {
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
	
	        window.supportDefinePropertyOnObject = true;
	
	        fixObject('defineProperty', function (object, prop, desc) {
	          var descs = {};
	          descs[prop] = desc;
	          return Object.defineProperties(object, descs);
	        }, supportDefinePropertyOnDom ? Object.defineProperty : null);
	
	        fixObject('defineProperties', function (object, descs) {
	          var proxy = undefined,
	              prop = undefined,
	              proxyDesc = undefined;
	          if (VBProxy.isVBProxy(object)) {
	            proxy = object;
	            object = VBProxy.getVBProxyDesc(proxy).object;
	          }
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
	          return proxy;
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
	  })();
	}

/***/ }
/******/ ])
});
;
//# sourceMappingURL=shim.js.map