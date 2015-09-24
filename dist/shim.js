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
	__webpack_require__(5);

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';
	
	function fixFn(Type, name, lodash, fn) {
	  if (typeof Type[name] != 'function') {
	    if (typeof lodash == 'function') {
	      fn = lodash;
	      lodash = false;
	    }
	    if (typeof fn == 'function' && lodash === false) {
	      Type[name] = fn;
	    } else {
	      if (!(typeof lodash == 'string')) {
	        lodash = name;
	      }
	      Type[name] = function () {
	        if (window._) {
	          return window._[lodash].apply(window._, arguments);
	        } else {
	          fn.apply(this, arguments);
	        }
	      };
	    }
	  }
	}
	function fixProtoFn(Type, name, lodash, fn) {
	  Type = Type.prototype;
	  if (typeof Type[name] != 'function') {
	    if (typeof lodash == 'function') {
	      fn = lodash;
	      lodash = false;
	    }
	    if (typeof fn == 'function' && lodash === false) {
	      Type[name] = fn;
	    } else {
	      if (!(typeof lodash == 'string')) {
	        lodash = name;
	      }
	      Type[name] = function () {
	        if (window._) {
	          var arg = [this];
	          arg.push.apply(arg, arguments);
	          return window._[lodash].apply(window._, arguments);
	        } else {
	          fn.apply(this, arguments);
	        }
	      };
	    }
	  }
	}
	
	fixFn(Object, 'create');
	
	fixFn(Object, 'keys', function keys() {
	  var ret = [];
	  for (var key in this) {
	    if (Object.hasOwnProperty.call(this, key)) {
	      ret.push(key);
	    }
	  }
	  return ret;
	});
	
	if (!Object.setPrototypeOf) {
	  Object.getPrototypeOf = function getPrototypeOf(object) {
	    var proto = object.__proto__;
	    if (proto || proto === null) {
	      return proto;
	    } else if (typeof object.constructor == 'function') {
	      return object.constructor.prototype;
	    }
	    return null;
	  };
	  Object.setPrototypeOf = function setPrototypeOf(object, proto) {
	    object.__proto__ = proto;
	  };
	}
	
	fixFn(Array, 'isArray', function isArray(arr) {
	  return arr && arr instanceof Array;
	});
	
	fixProtoFn(Function, 'bind', function bind(scope) {
	  if (arguments.length < 2 && scope === undefined) {
	    return this;
	  }
	  var fn = this,
	      bindArgs = [];
	  bindArgs.push.apply(bindArgs, arguments);
	  return function () {
	    var args = [];
	    args.push.apply(args, bindArgs);
	    args.push.apply(args, arguments);
	    fn.apply(scope, args);
	  };
	});
	
	fixProtoFn(Array, 'forEach', function forEach(callback) {
	  for (var i = 0; i < this.length; i++) {
	    callback(this[i], i);
	  }
	  return this;
	});
	
	fixProtoFn(Array, 'map', function map(callback) {
	  var ret = [];
	  for (var i = 0; i < this.length; i++) {
	    ret.push(callback(this[i], i));
	  }
	  return ret;
	});
	
	fixProtoFn(Array, 'filter', function filter(callback) {
	  var ret = [];
	  for (var i = 0; i < this.length; i++) {
	    if (callback(this[i], i)) {
	      ret.push(this[i]);
	    }
	  }
	  return ret;
	});
	
	fixProtoFn(Array, 'indexOf', function indexOf(val) {
	  for (var i = 0; i < this.length; i++) {
	    if (this[i] === val) {
	      return i;
	    }
	  }
	  return -1;
	});

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Map & Set & WeakMap & WeakSet
	 */
	'use strict';
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	__webpack_require__(1);
	if (!window.Map) {
	  (function () {
	    var hash = function hash(value) {
	      return typeof value + ' ' + (_.isObject(value) ? value[HASH_BIND] || (value[HASH_BIND] = ++objHashIdx) : value.toString());
	    };
	
	    var ITERATOR_TYPE = {
	      KEY: 'key',
	      VALUE: 'value',
	      ENTRY: 'entry'
	    },
	        HASH_BIND = '__hash__',
	        objHashIdx = 0;
	
	    var Map = (function () {
	      function Map() {
	        _classCallCheck(this, Map);
	
	        this._map = {};
	        this._keyMap = {};
	        this._size = 0;
	      }
	
	      Map.prototype.has = function has(key) {
	        return hash(key) in this._keyMap;
	      };
	
	      Map.prototype.get = function get(key) {
	        var hcode = hash(key);
	        if (hcode in this._keyMap) {
	          return this._map[hcode];
	        }
	        return undefined;
	      };
	
	      Map.prototype.set = function set(key, val) {
	        var hcode = hash(key);
	        this._keyMap[hcode] = key;
	        this._map[hcode] = val;
	        if (!(hcode in this._keyMap)) {
	          this._size++;
	        }
	        return this;
	      };
	
	      Map.prototype['delete'] = function _delete(key) {
	        var hcode = hash(key);
	        if (hcode in this._keyMap) {
	          delete this._keyMap[hcode];
	          delete this._map[hcode];
	          this._size--;
	          return true;
	        }
	        return false;
	      };
	
	      Map.prototype.size = function size() {
	        return this._size;
	      };
	
	      Map.prototype.clear = function clear() {
	        this._keyMap = {};
	        this._map = {};
	        this._size = 0;
	      };
	
	      Map.prototype.forEach = function forEach(callback) {
	        var _this = this;
	
	        _.each(this._map, function (val, key) {
	          if (key in _this._keyMap) {
	            callback(val, key, _this);
	          }
	        });
	      };
	
	      Map.prototype.keys = function keys() {
	        return new MapIterator(this, ITERATOR_TYPE.KEY);
	      };
	
	      Map.prototype.values = function values() {
	        return new MapIterator(this, ITERATOR_TYPE.VALUE);
	      };
	
	      Map.prototype.entries = function entries() {
	        return new MapIterator(this, ITERATOR_TYPE.ENTRY);
	      };
	
	      Map.prototype.toString = function toString() {
	        return '[Object Map]';
	      };
	
	      return Map;
	    })();
	
	    var MapIterator = (function () {
	      function MapIterator(map, type) {
	        _classCallCheck(this, MapIterator);
	
	        this._index = 0;
	        this._map = map;
	        this._type = type;
	      }
	
	      MapIterator.prototype.next = function next() {
	        if (!this._hashs) {
	          this._hashs = _.keys(this._map._map);
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
	    })();
	
	    window.Map = Map;
	  })();
	}
	module.exports = window;

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
	})();
	
	function _createVBProxy(object, desc) {
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
	
	/*
	if (isSupported()) {
	
	  function fixPrototypeProp(Type, name) {
	    let fn = Type.prototype[name];
	    if (typeof fn === 'function') {
	      Type.prototype[name] = function() {
	        if (VBProxy.isVBProxy(this)) {
	          return fn.apply(this[DESC_BINDING].object, arguments);
	        }
	        return fn.apply(this, arguments);
	      }
	    }
	  }
	  function fixPrototypeProps(Type, props) {
	    for (let i = 0; i < props.length; i++) {
	      fixPrototypeProp(Type, props[i]);
	    }
	  }
	
	  fixPrototypeProps(Object, OBJECT_PROTO_PROPS);
	  fixPrototypeProps(Array, ARRAY_PROTO_PROPS);
	
	}
	*/
	
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
	module.exports = Object;

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	
	if (!window.requestAnimationFrame) {
	  (function () {
	    var lastTime = 0;
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
	  })();
	}

/***/ }
/******/ ])
});
;
//# sourceMappingURL=shim.js.map