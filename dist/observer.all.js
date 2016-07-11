/*!
 * observer.js v0.2.5 built in Mon, 11 Jul 2016 04:48:12 GMT
 * Copyright (c) 2016 Tao Zeng <tao.zeng.zt@gmail.com>
 * Released under the MIT license
 * support IE6+ and other browsers
 * support ES6 Proxy and Object.observe
 * https://github.com/tao-zeng/observer.js
 */
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
/******/ 	__webpack_require__.p = "http://localhost:8088/dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(1),
	    observer = __webpack_require__(7),
	    _proxy = __webpack_require__(8),
	    configuration = __webpack_require__(9);
	
	__webpack_require__(11);
	__webpack_require__(12);
	
	_.assignIf(observer, _, {
	  eq: function eq(o1, o2) {
	    return _proxy.eq(o1, o2);
	  },
	  obj: function obj(o) {
	    return _proxy.obj(o);
	  },
	  onproxy: function onproxy(o, h) {
	    return _proxy.on(o, h);
	  },
	  unproxy: function unproxy(o, h) {
	    return _proxy.un(o, h);
	  },
	
	  proxy: _proxy,
	  config: configuration.get()
	});
	
	module.exports = observer;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(2);
	var _ = __webpack_require__(4);
	
	module.exports = _.assignIf(_, {
	  timeoutframe: __webpack_require__(3),
	  Configuration: __webpack_require__(5)
	}, __webpack_require__(6));

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var tf = __webpack_require__(3);
	
	window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || tf.request;
	
	window.cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame || tf.cancel;
	
	function fixProto(Type, prop, val) {
	  if (!Type.prototype[prop]) Type.prototype[prop] = val;
	}
	
	fixProto(Function, 'bind', function bind(scope) {
	  var fn = this,
	      args = Array.prototype.slice.call(arguments, 1);
	
	  return function () {
	    return fn.apply(scope, args.concat(Array.prototype.slice.call(arguments)));
	  };
	});

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	exports.request = request;
	exports.cancel = cancel;
	var lastTime = void 0;
	
	function request(callback) {
	  var currTime = new Date().getTime(),
	      timeToCall = Math.max(0, 16 - (currTime - lastTime)),
	      reqId = setTimeout(function () {
	    callback(currTime + timeToCall);
	  }, timeToCall);
	  lastTime = currTime + timeToCall;
	  return reqId;
	}
	
	function cancel(reqId) {
	  clearTimeout(reqId);
	}

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	exports.hasOwnProp = hasOwnProp;
	exports.isDefine = isDefine;
	exports.isNull = isNull;
	exports.isNil = isNil;
	exports.isArray = isArray;
	exports.isFunc = isFunc;
	exports.isNumber = isNumber;
	exports.isNaN = isNaN;
	exports.isBool = isBool;
	exports.isDate = isDate;
	exports.isString = isString;
	exports.isObject = isObject;
	exports.isRegExp = isRegExp;
	exports.isArrayLike = isArrayLike;
	exports.each = each;
	exports.map = map;
	exports.filter = filter;
	exports.aggregate = aggregate;
	exports.keys = keys;
	exports.indexOf = indexOf;
	exports.lastIndexOf = lastIndexOf;
	exports.convert = convert;
	exports.reverseConvert = reverseConvert;
	exports.upperFirst = upperFirst;
	exports.ltrim = ltrim;
	exports.rtrim = rtrim;
	exports.trim = trim;
	exports.format = format;
	exports._format = _format;
	exports.parseExpr = parseExpr;
	exports.get = get;
	exports.has = has;
	exports.set = set;
	exports.getOwnProp = getOwnProp;
	exports.assignIf = assignIf;
	exports.emptyFunc = emptyFunc;
	exports.isExtendOf = isExtendOf;
	exports.dynamicClass = dynamicClass;
	var toStr = Object.prototype.toString,
	    hasOwn = Object.prototype.hasOwnProperty;
	
	function hasOwnProp(obj, prop) {
	  return hasOwn.call(obj, prop);
	}
	
	// ==============================================
	// type utils
	// ==============================================
	var argsType = exports.argsType = '[object Arguments]';
	var arrayType = exports.arrayType = '[object Array]';
	var funcType = exports.funcType = '[object Function]';
	var boolType = exports.boolType = '[object Boolean]';
	var numberType = exports.numberType = '[object Number]';
	var dateType = exports.dateType = '[object Date]';
	var stringType = exports.stringType = '[object String]';
	var objectType = exports.objectType = '[object Object]';
	var regexpType = exports.regexpType = '[object RegExp]';
	var nodeListType = exports.nodeListType = '[object NodeList]';
	
	function isDefine(obj) {
	  return obj === undefined;
	}
	
	function isNull(obj) {
	  return obj === null;
	}
	
	function isNil(obj) {
	  return obj === undefined || obj === null;
	}
	
	function isArray(obj) {
	  return toStr.call(obj) === arrayType;
	}
	
	function isFunc(obj) {
	  return toStr.call(obj) === funcType;
	}
	
	function isNumber(obj) {
	  return toStr.call(obj) === numberType;
	}
	
	function isNaN(obj) {
	  return obj === NaN;
	}
	
	function isBool(obj) {
	  return toStr.call(obj) === boolType;
	}
	
	function isDate(obj) {
	  return toStr.call(obj) === dateType;
	}
	
	function isString(obj) {
	  return toStr.call(obj) === stringType;
	}
	
	function isObject(obj) {
	  return toStr.call(obj) === objectType;
	}
	
	function isRegExp(obj) {
	  return toStr.call(obj) === regexpType;
	}
	
	function isArrayLike(obj) {
	  var type = toStr.call(obj);
	  switch (type) {
	    case argsType:
	    case arrayType:
	    case stringType:
	    case nodeListType:
	      return true;
	    default:
	      if (obj) {
	        var length = obj.length;
	        return isNumber(length) && length > 0 && length - 1 in obj;
	      }
	      return false;
	  }
	}
	
	// ==============================================
	// array utils
	// ==============================================
	function _eachObj(obj, callback, scope, own) {
	  var key = void 0,
	      isOwn = void 0;
	
	  scope = scope || obj;
	  for (key in obj) {
	    isOwn = hasOwnProp(obj, key);
	    if (own === false || isOwn) {
	      if (callback.call(scope, obj[key], key, obj, isOwn) === false) return false;
	    }
	  }
	  return true;
	}
	
	function _eachArray(obj, callback, scope) {
	  var i = 0,
	      j = obj.length;
	
	  scope = scope || obj;
	  for (; i < j; i++) {
	    if (callback.call(scope, obj[i], i, obj, true) === false) return false;
	  }
	  return true;
	}
	
	function each(obj, callback, scope, own) {
	  if (isArrayLike(obj)) {
	    return _eachArray(obj, callback, scope);
	  } else if (!isNil(obj)) {
	    return _eachObj(obj, callback, scope, own);
	  }
	  return true;
	}
	
	function map(obj, callback, scope, own) {
	  var ret = void 0;
	
	  function cb(val, key) {
	    ret[key] = callback.apply(this, arguments);
	  }
	
	  if (isArrayLike(obj)) {
	    ret = [];
	    _eachArray(obj, cb, scope);
	  } else {
	    ret = {};
	    if (!isNil(obj)) _eachObj(obj, cb, scope, own);
	  }
	  return ret;
	}
	
	function filter(obj, callback, scope, own) {
	  var ret = void 0;
	
	  if (isArrayLike(obj)) {
	    ret = [];
	    _eachArray(obj, function (val) {
	      if (callback.apply(this, arguments)) ret.push(val);
	    }, scope);
	  } else {
	    ret = {};
	    if (!isNil(obj)) _eachObj(obj, function (val, key) {
	      if (callback.apply(this, arguments)) ret[key] = val;
	    }, scope, own);
	  }
	  return ret;
	}
	
	function aggregate(obj, callback, defVal, scope, own) {
	  var rs = defVal;
	
	  each(obj, function (val, key, obj, isOwn) {
	    rs = callback.call(this, rs, val, key, obj, isOwn);
	  }, scope, own);
	  return rs;
	}
	
	function keys(obj, filter, scope, own) {
	  var keys = [];
	
	  each(obj, function (val, key) {
	    if (!filter || filter.apply(this, arguments)) keys.push(key);
	  }, scope, own);
	  return keys;
	}
	
	function _indexOfArray(array, val) {
	  var i = 0,
	      l = array.length;
	
	  for (; i < l; i++) {
	    if (array[i] === val) return i;
	  }
	  return -1;
	}
	
	function _lastIndexOfArray(array, val) {
	  var i = array.length;
	
	  while (i-- > 0) {
	    if (array[i] === val) return i;
	  }
	}
	
	function _indexOfObj(obj, val, own) {
	  for (key in obj) {
	    if (own === false || hasOwnProp(obj, key)) {
	      if (obj[key] === val) return key;
	    }
	  }
	  return undefined;
	}
	
	function indexOf(obj, val, own) {
	  if (isArrayLike(obj)) {
	    return _indexOfArray(obj, val);
	  } else {
	    return _indexOfObj(obj, val, own);
	  }
	}
	
	function lastIndexOf(obj, val, own) {
	  if (isArrayLike(obj)) {
	    return _lastIndexOfArray(obj, val);
	  } else {
	    return _indexOfObj(obj, val, own);
	  }
	}
	
	function convert(obj, keyGen, valGen, scope, own) {
	  var o = {};
	
	  each(obj, function (val, key) {
	    o[keyGen ? keyGen.apply(this, arguments) : key] = valGen ? valGen.apply(this, arguments) : val;
	  }, scope, own);
	  return o;
	}
	
	function reverseConvert(obj, valGen, scope, own) {
	  var o = {};
	
	  each(obj, function (val, key) {
	    o[val] = valGen ? valGen.apply(this, arguments) : key;
	  }, scope, own);
	  return o;
	}
	
	// ==============================================
	// string utils
	// ==============================================
	var regFirstChar = /^[a-z]/,
	    regLeftTrim = /^\s+/,
	    regRightTrim = /\s+$/,
	    regTrim = /(^\s+)|(\s+$)/g;
	
	function _uppercase(k) {
	  return k.toUpperCase();
	}
	
	function upperFirst(str) {
	  return str.replace(regFirstChar, _uppercase);
	}
	
	function ltrim(str) {
	  return str.replace(regLeftTrim, '');
	}
	
	function rtrim(str) {
	  return str.replace(regRightTrim, '');
	}
	
	function trim(str) {
	  return str.replace(regTrim, '');
	}
	
	var regFormat = /%%|%(\d+\$)?([-+#0 ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([scboxXuidfegpEGP])/g;
	
	function pad(str, len, chr, leftJustify) {
	  var padding = str.length >= len ? '' : Array(1 + len - str.length >>> 0).join(chr);
	
	  return leftJustify ? str + padding : padding + str;
	}
	
	function justify(value, prefix, leftJustify, minWidth, zeroPad) {
	  var diff = minWidth - value.length;
	
	  if (diff > 0) return leftJustify || !zeroPad ? pad(value, minWidth, ' ', leftJustify) : value.slice(0, prefix.length) + pad('', diff, '0', true) + value.slice(prefix.length);
	  return value;
	}
	
	function format(str) {
	  return _format(str, Array.prototype.slice.call(arguments, 1)).format;
	}
	
	function _format(str, args) {
	  var i = 0;
	  str = str.replace(regFormat, function (substring, valueIndex, flags, minWidth, _, precision, type) {
	    if (substring == '%%') return '%';
	
	    var leftJustify = false,
	        positivePrefix = '',
	        zeroPad = false,
	        prefixBaseX = false;
	
	    if (flags) each(flags, function (c) {
	      switch (c) {
	        case ' ':
	          positivePrefix = ' ';
	          break;
	        case '+':
	          positivePrefix = '+';
	          break;
	        case '-':
	          leftJustify = true;
	          break;
	        case '0':
	          zeroPad = true;
	          break;
	        case '#':
	          prefixBaseX = true;
	          break;
	      }
	    });
	
	    if (!minWidth) {
	      minWidth = 0;
	    } else if (minWidth == '*') {
	      minWidth = +args[i++];
	    } else if (minWidth.charAt(0) == '*') {
	      minWidth = +args[minWidth.slice(1, -1)];
	    } else {
	      minWidth = +minWidth;
	    }
	
	    if (minWidth < 0) {
	      minWidth = -minWidth;
	      leftJustify = true;
	    }
	
	    if (!isFinite(minWidth)) throw new Error('sprintf: (minimum-)width must be finite');
	
	    if (precision && precision.charAt(0) == '*') {
	      precision = +args[precision == '*' ? i++ : precision.slice(1, -1)];
	      if (precision < 0) precision = null;
	    }
	
	    if (precision == null) {
	      precision = 'fFeE'.indexOf(type) > -1 ? 6 : type == 'd' ? 0 : void 0;
	    } else {
	      precision = +precision;
	    }
	
	    var value = valueIndex ? args[valueIndex.slice(0, -1)] : args[i++],
	        prefix = void 0,
	        base = void 0;
	
	    switch (type) {
	      case 'c':
	        value = String.fromCharCode(+value);
	      case 's':
	        {
	          value = String(value);
	          if (precision != null) value = value.slice(0, precision);
	          prefix = '';
	          break;
	        }
	      case 'b':
	        base = 2;
	        break;
	      case 'o':
	        base = 8;
	        break;
	      case 'u':
	        base = 10;
	        break;
	      case 'x':
	      case 'X':
	        base = 16;
	        break;
	      case 'i':
	      case 'd':
	        {
	          var _number = parseInt(+value);
	          if (isNaN(_number)) return '';
	          prefix = _number < 0 ? '-' : positivePrefix;
	          value = prefix + pad(String(Math.abs(_number)), precision, '0', false);
	          break;
	        }
	      case 'e':
	      case 'E':
	      case 'f':
	      case 'F':
	      case 'g':
	      case 'G':
	      case 'p':
	      case 'P':
	        {
	          var _number2 = +value;
	          if (isNaN(_number2)) return '';
	          prefix = _number2 < 0 ? '-' : positivePrefix;
	          var method = void 0;
	          if ('p' != type.toLowerCase()) {
	            method = ['toExponential', 'toFixed', 'toPrecision']['efg'.indexOf(type.toLowerCase())];
	          } else {
	            // Count significant-figures, taking special-care of zeroes ('0' vs '0.00' etc.)
	            var sf = String(value).replace(/[eE].*|[^\d]/g, '');
	            sf = (_number2 ? sf.replace(/^0+/, '') : sf).length;
	            precision = precision ? Math.min(precision, sf) : precision;
	            method = !precision || precision <= sf ? 'toPrecision' : 'toExponential';
	          }
	          var number_str = Math.abs(_number2)[method](precision);
	          // number_str = thousandSeparation ? thousand_separate(number_str): number_str
	          value = prefix + number_str;
	          break;
	        }
	      case 'n':
	        return '';
	      default:
	        return substring;
	    }
	
	    if (base) {
	      var number = value >>> 0;
	      prefix = prefixBaseX && base != 10 && number && ['0b', '0', '0x'][base >> 3] || '';
	      value = prefix + pad(number.toString(base), precision || 0, '0', false);
	    }
	    var justified = justify(value, prefix, leftJustify, minWidth, zeroPad);
	    return 'EFGPX'.indexOf(type) > -1 ? justified.toUpperCase() : justified;
	  });
	  return {
	    format: str,
	    formatArgCount: i
	  };
	}
	
	// ==============================================
	// object utils
	// ==============================================
	var exprCache = {},
	    regPropertyName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g,
	    regEscapeChar = /\\(\\)?/g;
	
	function parseExpr(expr, autoCache) {
	  if (isArray(expr)) {
	    return expr;
	  } else if (isString(expr)) {
	    var _ret = function () {
	      var rs = exprCache[expr];
	
	      if (rs) return {
	          v: rs
	        };
	      rs = autoCache ? exprCache[expr] = [] : [];
	      expr.replace(regPropertyName, function (match, number, quote, string) {
	        rs.push(quote ? string.replace(regEscapeChar, '$1') : number || match);
	      });
	      return {
	        v: rs
	      };
	    }();
	
	    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
	  } else {
	    return [];
	  }
	}
	
	function get(obj, expr, defVal, lastOwn, own) {
	  var i = 0,
	      path = parseExpr(expr, true),
	      l = path.length - 1,
	      prop = void 0;
	
	  while (!isNil(obj) && i < l) {
	    prop = path[i++];
	    if (own && !hasOwnProp(obj, prop)) return defVal;
	    obj = obj[prop];
	  }
	  prop = path[i];
	  return i == l && !isNil(obj) && (own ? hasOwnProp(obj, prop) : prop in obj) ? obj[prop] : defVal;
	}
	
	function has(obj, expr, lastOwn, own) {
	  var i = 0,
	      path = parseExpr(expr, true),
	      l = path.length - 1,
	      prop = void 0;
	
	  while (!isNil(obj) && i < l) {
	    prop = path[i++];
	    if (own && !hasOwnProp(obj, prop)) return false;
	    obj = obj[prop];
	  }
	  prop = path[i];
	  return i == l && !isNil(obj) && (own ? hasOwnProp(obj, prop) : prop in obj);
	}
	
	function set(obj, expr, value) {
	  var i = 0,
	      path = parseExpr(expr, true),
	      l = path.length - 1,
	      prop = path[0],
	      _obj = obj;
	
	  for (; i < l; i++) {
	    if (isNil(_obj[prop])) _obj = _obj[prop] = {};
	    prop = path[i + 1];
	  }
	  obj[prop] = value;
	  return obj;
	}
	
	function getOwnProp(obj, key) {
	  return hasOwnProp(obj, key) ? obj[key] : undefined;
	}
	
	var prototypeOf = exports.prototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function getPrototypeOf(obj) {
	  return obj.__proto__;
	};
	
	var setPrototypeOf = exports.setPrototypeOf = Object.setPrototypeOf || function setPrototypeOf(obj, proto) {
	  obj.__proto__ = proto;
	};
	
	var assign = exports.assign = Object.assign || function assign(target) {
	  var source = void 0,
	      key = void 0,
	      i = 1,
	      l = arguments.length;
	
	  for (; i < l; i++) {
	    source = arguments[i];
	    for (key in source) {
	      if (hasOwnProp(source, key)) target[key] = source[key];
	    }
	  }
	  return target;
	};
	
	function assignIf(target) {
	  var source = void 0,
	      key = void 0,
	      i = 1,
	      l = arguments.length;
	
	  for (; i < l; i++) {
	    source = arguments[i];
	    for (key in source) {
	      if (hasOwnProp(source, key) && !hasOwnProp(target, key)) target[key] = source[key];
	    }
	  }
	  return target;
	}
	
	function emptyFunc() {}
	
	var create = exports.create = Object.create || function (parent, props) {
	  emptyFunc.prototype = parent;
	  var obj = new emptyFunc();
	  emptyFunc.prototype = undefined;
	  if (props) {
	    for (var prop in props) {
	      if (hasOwnProp(props, prop)) obj[prop] = props[prop];
	    }
	  }
	  return obj;
	};
	
	function isExtendOf(cls, parent) {
	  if (!isFunc(cls)) return cls instanceof parent;
	
	  var proto = cls;
	
	  while (proto = prototypeOf(proto)) {
	    if (proto === parent) return true;
	  }
	  return false;
	}
	
	var classOptionConstructorKey = 'constructor',
	    classOptionExtendKey = 'extend';
	
	function dynamicClass(cfg, options) {
	  var constructorKey = void 0,
	      extendKey = void 0,
	      constructor = void 0,
	      superCls = void 0,
	      cls = void 0;
	
	  if (!isObject(cfg)) throw TypeError('Invalid Class Config: ' + cfg);
	
	  options = options || {};
	  constructorKey = isString(options.constructor) ? options.constructor : classOptionConstructorKey;
	  extendKey = isString(options.extend) ? options.extend : classOptionExtendKey;
	  constructor = cfg[constructorKey];
	  superCls = cfg[extendKey];
	
	  if (!isFunc(constructor) || constructor === Object) constructor = undefined;
	  if (!isFunc(superCls) || superCls === Object) superCls = undefined;
	
	  cls = function (constructor, superCls) {
	    function DynamicClass() {
	      if (superCls && !(this instanceof superCls)) throw new TypeError('Cannot call a class as a function');
	      if (constructor) {
	        constructor.apply(this, arguments);
	      } else if (superCls) {
	        superCls.apply(this, arguments);
	      }
	    }
	    var proto = {
	      constructor: {
	        value: DynamicClass,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    };
	
	    DynamicClass.prototype = superCls ? create(superCls.prototype, proto) : proto;
	    setPrototypeOf(DynamicClass, superCls || {});
	    return DynamicClass;
	  }(constructor, superCls);
	
	  each(cfg, function (val, key) {
	    if (key !== constructorKey) cls.prototype[key] = val;
	  });
	  return cls;
	}

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(4);
	
	var Configuration = _.dynamicClass({
	  constructor: function constructor(def) {
	    this.cfg = def || {};
	  },
	  register: function register(name, defVal) {
	    var _this = this;
	
	    if (arguments.length == 1) {
	      _.each(name, function (val, name) {
	        _this.cfg[name] = val;
	      });
	    } else {
	      this.cfg[name] = defVal;
	    }
	    return this;
	  },
	  config: function config(cfg) {
	    var _this2 = this;
	
	    if (cfg) _.each(this.cfg, function (val, key) {
	      if (_.hasOwnProp(cfg, key)) _this2.cfg[key] = cfg[key];
	    });
	    return this;
	  },
	  get: function get(name) {
	    return arguments.length ? this.cfg[name] : _.create(this.cfg);
	  }
	});
	module.exports = Configuration;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	var _ = __webpack_require__(4);
	
	var logLevels = ['debug', 'info', 'warn', 'error'],
	    tmpEl = document.createElement('div'),
	    slice = Array.prototype.slice;
	
	var SimulationConsole = _.dynamicClass({
	  constructor: function constructor() {
	    tmpEl.innerHTML = '<div id="simulation_console"\n    style="position:absolute; top:0; right:0; font-family:courier,monospace; background:#eee; font-size:10px; padding:10px; width:200px; height:200px;">\n  <a style="float:right; padding-left:1em; padding-bottom:.5em; text-align:right;">Clear</a>\n  <div id="simulation_console_body"></div>\n</div>';
	    this.el = tmpEl.childNodes[0];
	    this.clearEl = this.el.childNodes[0];
	    this.bodyEl = this.el.childNodes[1];
	  },
	  appendTo: function appendTo(el) {
	    el.appendChild(this.el);
	  },
	  log: function log(style, msg) {
	    tmpEl.innerHTML = '<span style="' + style + '">' + msg + '</span>';
	    this.bodyEl.appendChild(tmpEl.childNodes[0]);
	  },
	  parseMsg: function parseMsg(args) {
	    var msg = args[0];
	
	    if (_.isString(msg)) {
	      var f = _._format.apply(_, args);
	
	      return [f.format].concat(slice.call(args, f.formatArgCount)).join(' ');
	    }
	    return args.join(' ');
	  },
	  debug: function debug() {
	    this.log('color: red;', this.parseMsg(arguments));
	  },
	  info: function info() {
	    this.log('color: red;', this.parseMsg(arguments));
	  },
	  warn: function warn() {
	    this.log('color: red;', this.parseMsg(arguments));
	  },
	  error: function error() {
	    this.log('color: red;', this.parseMsg(arguments));
	  },
	  clear: function clear() {
	    this.bodyEl.innerHTML = '';
	  }
	});
	
	var console = window.console;
	
	if (console && !console.debug) console.debug = function () {
	  console.log.apply(this, arguments);
	};
	
	var Logger = exports.Logger = _.dynamicClass({
	  constructor: function constructor(_module, level) {
	    this.module = _module;
	    this.level = _.indexOf(logLevels, level || 'info');
	  },
	  setLevel: function setLevel(level) {
	    this.level = _.indexOf(logLevels, level || 'info');
	  },
	  getLevel: function getLevel() {
	    return logLevels[this.level];
	  },
	  _print: function _print(level, args, trace) {
	    console[level].apply(console, args);
	    if (trace && console.trace) console.trace();
	  },
	  _log: function _log(level, args, trace) {
	    if (level < this.level || !console) return;
	    var msg = '[%s] %s -' + (_.isString(args[0]) ? ' ' + args.shift() : ''),
	        errors = [];
	
	    args = _.filter(args, function (arg) {
	      if (arg instanceof Error) {
	        errors.push(arg);
	        return false;
	      }
	      return true;
	    });
	    _.each(errors, function (err) {
	      args.push.call(args, err.message, '\n', err.stack);
	    });
	    level = logLevels[level];
	    this._print(level, [msg, level, this.module].concat(args), trace);
	  },
	  debug: function debug() {
	    this._log(0, slice.call(arguments, 0));
	  },
	  info: function info() {
	    this._log(1, slice.call(arguments, 0));
	  },
	  warn: function warn() {
	    this._log(2, slice.call(arguments, 0));
	  },
	  error: function error() {
	    this._log(3, slice.call(arguments, 0));
	  }
	});
	
	Logger.enableSimulationConsole = function enableSimulationConsole() {
	  if (!console) {
	    console = new SimulationConsole();
	    console.appendTo(document.body);
	  }
	};
	
	var logger = exports.logger = new Logger('default', 'info');

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var proxy = __webpack_require__(8);
	var vbproxy = __webpack_require__(10);
	var _ = __webpack_require__(1);
	var timeoutframe = _.timeoutframe;
	var configuration = __webpack_require__(9);
	var config = configuration.cfg;
	
	configuration.register({
	  lazy: true,
	  animationFrame: true,
	  observerKey: '__OBSERVER__',
	  expressionKey: '__EXPR_OBSERVER__'
	});
	
	function abstractFunc() {}
	
	var Observer = _.dynamicClass({
	  constructor: function constructor(target) {
	    this.isArray = _.isArray(target);
	    if (!this.isArray && !_.isObject(target)) throw TypeError('can not observe object[' + Object.prototype.toString.call(target) + ']');
	    this.target = target;
	    this.obj = target;
	    this.listens = {};
	    this.changeRecords = {};
	    this._notify = this._notify.bind(this);
	    this.watchPropNum = 0;
	    this._init();
	  },
	  _fire: function _fire(attr, val, oldVal) {
	    var _this = this;
	
	    var handlers = void 0;
	
	    if (proxy.eq(val, oldVal) && !(this.isArray && attr === 'length')) return;
	    if (!(handlers = this.listens[attr])) return;
	
	    _.each(handlers.slice(), function (handler) {
	      handler(attr, val, oldVal, _this.target);
	    });
	  },
	  _notify: function _notify() {
	    var _this2 = this;
	
	    var obj = this.obj;
	
	    _.each(this.changeRecords, function (val, attr) {
	      _this2._fire(attr, obj[attr], val);
	    });
	    this.request_frame = undefined;
	    this.changeRecords = {};
	  },
	  _addChangeRecord: function _addChangeRecord(attr, oldVal) {
	    if (!config.lazy) {
	      this._fire(attr, this.obj[attr], oldVal);
	    } else if (!(attr in this.changeRecords)) {
	      this.changeRecords[attr] = oldVal;
	      if (!this.request_frame) {
	        this.request_frame = config.animationFrame ? window.requestAnimationFrame(this._notify) : timeoutframe.request(this._notify);
	      }
	    }
	  },
	  checkHandler: function checkHandler(handler) {
	    if (!_.isFunc(handler)) throw TypeError('Invalid Observe Handler');
	  },
	  hasListen: function hasListen(attr, handler) {
	    switch (arguments.length) {
	      case 0:
	        return !!this.watchPropNum;
	      case 1:
	        if (_.isFunc(attr)) {
	          return !_.each(this.listens, function (handlers) {
	            return _.lastIndexOf(handlers, attr) !== -1;
	          });
	        }
	        return !!listens[attr];
	      default:
	        this.checkHandler(handler);
	        return _.lastIndexOf(listens[attr], handler) !== -1;
	    }
	  },
	  on: function on(attr, handler) {
	    var handlers = void 0;
	
	    this.checkHandler(handler);
	    if (!(handlers = this.listens[attr])) {
	      this.listens[attr] = [handler];
	      this.watchPropNum++;
	      this._watch(attr);
	    } else {
	      handlers.push(handler);
	    }
	    return this.target;
	  },
	  _cleanListen: function _cleanListen(attr) {
	    this.listens[attr] = undefined;
	    this.watchPropNum--;
	    this._unwatch(attr);
	  },
	  un: function un(attr, handler) {
	    var handlers = this.listens[attr];
	
	    if (handlers) {
	      if (arguments.length == 1) {
	        this._cleanListen(attr);
	      } else {
	        this.checkHandler(handler);
	
	        var i = handlers.length;
	        while (i--) {
	          if (handlers[i] === handler) {
	            handlers.splice(i, 1);
	            if (!handlers.length) this._cleanListen(attr);
	            break;
	          }
	        }
	      }
	    }
	    return this.target;
	  },
	  destroy: function destroy() {
	    if (this.request_frame) {
	      config.animationFrame ? window.cancelAnimationFrame(this.request_frame) : timeoutframe.cancel(this.request_frame);
	      this.request_frame = undefined;
	    }
	    var obj = this.obj;
	    this._destroy();
	    this.obj = undefined;
	    this.target = undefined;
	    this.listens = undefined;
	    this.changeRecords = undefined;
	    return obj;
	  },
	
	  _init: abstractFunc,
	  _destroy: abstractFunc,
	  _watch: abstractFunc,
	  _unwatch: abstractFunc
	});
	
	function _hasListen(obj, attr, handler) {
	  var observer = _.getOwnProp(obj, config.observerKey);
	
	  return observer ? arguments.length == 1 ? observer.hasListen() : arguments.length == 2 ? observer.hasListen(attr) : observer.hasListen(attr, handler) : false;
	}
	
	function _on(obj, attr, handler) {
	  var observer = _.getOwnProp(obj, config.observerKey);
	
	  if (!observer) {
	    obj = proxy.obj(obj);
	    observer = new Observer(obj);
	    obj[config.observerKey] = observer;
	  }
	  return observer.on(attr, handler);
	}
	
	function _un(obj, attr, handler) {
	  var observer = _.getOwnProp(obj, config.observerKey);
	
	  if (observer) {
	    obj = arguments.length == 2 ? observer.un(attr) : observer.un(attr, handler);
	    if (!observer.hasListen()) {
	      obj[config.observerKey] = undefined;
	      return observer.destroy();
	    }
	  }
	  return obj;
	}
	
	var expressionIdGenerator = 0;
	
	var Expression = _.dynamicClass({
	  constructor: function constructor(target, expr, path) {
	    this.id = expressionIdGenerator++;
	    this.expr = expr;
	    this.handlers = [];
	    this.observers = [];
	    this.path = path || _.parseExpr(expr);
	    this.observeHandlers = this._initObserveHandlers();
	    this.obj = proxy.obj(target);
	    this.target = this._observe(this.obj, 0);
	    this._onTargetProxy = this._onTargetProxy.bind(this);
	    proxy.on(target, this._onTargetProxy);
	  },
	  _onTargetProxy: function _onTargetProxy(obj, proxy) {
	    this.target = proxy;
	  },
	  _observe: function _observe(obj, idx) {
	    var prop = this.path[idx],
	        o = void 0;
	
	    if (idx + 1 < this.path.length && (o = obj[prop])) obj[prop] = this._observe(proxy.obj(o), idx + 1);
	    return _on(obj, prop, this.observeHandlers[idx]);
	  },
	  _unobserve: function _unobserve(obj, idx) {
	    var prop = this.path[idx],
	        o = void 0,
	        ret = void 0;
	
	    ret = _un(obj, prop, this.observeHandlers[idx]);
	    if (idx + 1 < this.path.length && (o = obj[prop])) obj[prop] = this._unobserve(proxy.obj(o), idx + 1);
	    return ret;
	  },
	  _initObserveHandlers: function _initObserveHandlers() {
	    return _.map(this.path, function (prop, i) {
	      return this._createObserveHandler(i);
	    }, this);
	  },
	  _createObserveHandler: function _createObserveHandler(idx) {
	    var _this3 = this;
	
	    var path = this.path.slice(0, idx + 1),
	        rpath = this.path.slice(idx + 1),
	        ridx = this.path.length - idx - 1;
	
	    return function (prop, val, oldVal) {
	      if (ridx) {
	        if (oldVal) {
	          oldVal = proxy.obj(oldVal);
	          _this3._unobserve(oldVal, idx + 1);
	          oldVal = _.get(oldVal, rpath);
	        } else {
	          oldVal = undefined;
	        }
	        if (val) {
	          val = proxy.obj(val);
	          _this3._observe(val, idx + 1);
	          val = _.get(val, rpath);
	        } else {
	          val = undefined;
	        }
	        if (proxy.eq(val, oldVal)) return;
	      }
	      _.each(_this3.handlers.slice(), function (h) {
	        h(this.expr, val, oldVal, this.target);
	      }, _this3);
	    };
	  },
	  checkHandler: function checkHandler(handler) {
	    if (!_.isFunc(handler)) throw TypeError('Invalid Observe Handler');
	  },
	  on: function on(handler) {
	    this.checkHandler(handler);
	    this.handlers.push(handler);
	    return this;
	  },
	  un: function un(handler) {
	    if (!arguments.length) {
	      this.handlers = [];
	    } else {
	      this.checkHandler(handler);
	
	      var handlers = this.handlers,
	          i = handlers.length;
	
	      while (i--) {
	        if (handlers[i] === handler) {
	          handlers.splice(i, 1);
	          break;
	        }
	      }
	    }
	    return this;
	  },
	  hasListen: function hasListen(handler) {
	    return arguments.length ? _.lastIndexOf(this.handlers, handler) != -1 : !!this.handlers.length;
	  },
	  destory: function destory() {
	    proxy.un(this.target, this._onTargetProxy);
	    var obj = this._unobserve(this.obj, 0);
	    this.obj = undefined;
	    this.target = undefined;
	    this.expr = undefined;
	    this.handlers = undefined;
	    this.path = undefined;
	    this.observers = undefined;
	    this.observeHandlers = undefined;
	    this.target = undefined;
	    return obj;
	  }
	});
	
	var policies = [],
	    policyNames = {};
	
	var inited = false;
	
	module.exports = {
	  registerPolicy: function registerPolicy(name, priority, checker, policy) {
	    policies.push({
	      name: name,
	      priority: priority,
	      policy: policy,
	      checker: checker
	    });
	    policies.sort(function (p1, p2) {
	      return p1.priority - p2.priority;
	    });
	    return this;
	  },
	  init: function init(cfg) {
	    if (!inited) {
	      configuration.config(cfg);
	      if (_.each(policies, function (policy) {
	        if (policy.checker(config)) {
	          _.each(policy.policy(config), function (val, key) {
	            Observer.prototype[key] = val;
	          });
	          config.policy = policy.name;
	          return false;
	        }
	      }) !== false) throw Error('not supported');
	      inited = true;
	    }
	    return this;
	  },
	  on: function on(obj, expr, handler) {
	    var path = _.parseExpr(expr);
	
	    if (path.length > 1) {
	      var map = _.getOwnProp(obj, config.expressionKey),
	          exp = map ? map[expr] : undefined;
	
	      if (!exp) {
	        exp = new Expression(obj, expr, path);
	        if (!map) map = obj[config.expressionKey] = {};
	        map[expr] = exp;
	      }
	      exp.on(handler);
	      return exp.target;
	    }
	    return _on(obj, expr, handler);
	  },
	  un: function un(obj, expr, handler) {
	    var path = _.parseExpr(expr);
	
	    if (path.length > 1) {
	      var map = _.getOwnProp(obj, config.expressionKey),
	          exp = map ? map[expr] : undefined;
	
	      if (exp) {
	        arguments.length == 2 ? exp.un() : exp.un(handler);
	        if (!exp.hasListen()) {
	          map[expr] = undefined;
	          return exp.destory();
	        }
	        return exp.target;
	      }
	      return proxy.proxy(obj) || obj;
	    }
	    return arguments.length == 2 ? _un(obj, expr) : _un(obj, expr, handler);
	  },
	  hasListen: function hasListen(obj, expr, handler) {
	    var l = arguments.length;
	
	    switch (l) {
	      case 1:
	        return _hasListen(obj);
	      case 2:
	        if (_.isFunc(expr)) return _hasListen(obj, expr);
	    }
	
	    var path = _.parseExpr(expr);
	
	    if (path.length > 1) {
	      var map = _.getOwnProp(obj, config.expressionKey),
	          exp = map ? map[expr] : undefined;
	
	      return exp ? l == 2 ? true : exp.hasListen(handler) : false;
	    }
	    return _hasListen.apply(window, arguments);
	  }
	};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var toStr = Object.prototype.toString;
	var _ = __webpack_require__(1);
	var hasOwnProp = _.hasOwnProp;
	var configuration = __webpack_require__(9);
	var LISTEN_CONFIG = 'proxyListenKey';
	
	configuration.register(LISTEN_CONFIG, '__PROXY_LISTENERS__');
	
	var defaultPolicy = {
	  eq: function eq(o1, o2) {
	    return o1 === o2;
	  },
	  obj: function obj(o) {
	    return o;
	  },
	  proxy: function proxy(o) {
	    return o;
	  }
	},
	    apply = {
	  change: function change(obj, p) {
	    var handlers = _.getOwnProp(obj, configuration.get(LISTEN_CONFIG));
	
	    if (handlers) {
	      var i = handlers.length;
	      while (i--) {
	        handlers[i](obj, p);
	      }
	    }
	  },
	  on: function on(obj, handler) {
	    if (!_.isFunc(handler)) throw TypeError('Invalid Proxy Event Handler[' + handler);
	    var key = configuration.get(LISTEN_CONFIG),
	        handlers = _.getOwnProp(obj, key);
	
	    if (!handlers) obj[key] = handlers = [];
	    handlers.push(handler);
	  },
	  un: function un(obj, handler) {
	    var handlers = _.getOwnProp(obj, configuration.get(LISTEN_CONFIG));
	
	    if (handlers) {
	      if (_.isFunc(handler)) {
	        var i = handlers.length;
	
	        while (i-- > 0) {
	          if (handlers[i] === handler) {
	            handlers.splice(i, 1);
	            return true;
	          }
	        }
	      }
	    }
	    return false;
	  },
	  clean: function clean(obj) {
	    if (obj[proxy.listenKey]) obj[proxy.listenKey] = undefined;
	  }
	};
	
	function proxy(o) {
	  return proxy.proxy(o);
	}
	
	_.assign(proxy, {
	  isEnable: function isEnable() {
	    return policy === defaultPolicy;
	  },
	  enable: function enable(policy) {
	    applyPolicy(policy);
	  },
	  disable: function disable() {
	    applyPolicy(defaultPolicy);
	  }
	});
	
	function applyPolicy(policy) {
	  var _apply = policy !== defaultPolicy ? function (fn, name) {
	    proxy[name] = fn;
	  } : function (fn, name) {
	    proxy[name] = _.emptyFunc;
	  };
	  _.each(apply, _apply);
	  _.each(policy, function (fn, name) {
	    proxy[name] = fn;
	  });
	}
	
	proxy.disable();
	
	_.get = function (obj, expr, defVal, lastOwn, own) {
	  var i = 0,
	      path = _.parseExpr(expr, true),
	      l = path.length - 1,
	      prop = void 0;
	
	  while (!_.isNil(obj) && i < l) {
	    prop = path[i++];
	    obj = proxy.obj(obj);
	    if (own && !hasOwnProp(obj, prop)) return defVal;
	    obj = obj[prop];
	  }
	  obj = proxy.obj(obj);
	  prop = path[i];
	  return i == l && !_.isNil(obj) && (own ? hasOwnProp(obj, prop) : prop in obj) ? obj[prop] : defVal;
	};
	
	_.hasOwnProp = function (obj, prop) {
	  return hasOwnProp(proxy.obj(obj), prop);
	};
	module.exports = proxy;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _require = __webpack_require__(1);
	
	var Configuration = _require.Configuration;
	
	
	module.exports = new Configuration();

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(1),
	    hasOwn = Object.prototype.hasOwnProperty,
	    RESERVE_PROPS = 'hasOwnProperty,toString,toLocaleString,isPrototypeOf,propertyIsEnumerable,valueOf'.split(','),
	    RESERVE_ARRAY_PROPS = 'concat,copyWithin,entries,every,fill,filter,find,findIndex,forEach,indexOf,lastIndexOf,length,map,keys,join,pop,push,reverse,reverseRight,some,shift,slice,sort,splice,toSource,unshift'.split(',');
	
	var VBClassFactory = _.dynamicClass({
	  constBind: '__VB_CONST__',
	  descBind: '__VB_PROXY__',
	  classNameGenerator: 0,
	  constructor: function constructor(defProps, onProxyChange) {
	    this.classPool = {};
	    this.defPropMap = {};
	    this.onProxyChange = onProxyChange;
	    this.addDefProps(defProps);
	    this.initConstScript();
	  },
	  setConstBind: function setConstBind(constBind) {
	    this.constBind = constBind;
	    this.initConstScript();
	  },
	  setDescBind: function setDescBind(descBind) {
	    this.descBind = descBind;
	    this.initConstScript();
	  },
	  addDefProps: function addDefProps(defProps) {
	    var defPropMap = this.defPropMap;
	
	    _.each(defProps || [], function (prop) {
	      defPropMap[prop] = true;
	    });
	    this.defProps = _.keys(defPropMap);
	    this.initReserveProps();
	  },
	  initReserveProps: function initReserveProps() {
	    this.reserveProps = RESERVE_PROPS.concat(_.keys(this.defPropMap) || []);
	    this.reserveArrayProps = this.reserveProps.concat(RESERVE_ARRAY_PROPS);
	    this.reservePropMap = _.reverseConvert(this.reserveProps);
	    this.reserveArrayPropMap = _.reverseConvert(this.reserveArrayProps);
	  },
	  initConstScript: function initConstScript() {
	    this.constScript = ['\tPublic [', this.descBind, ']\r\n', '\tPublic Default Function [', this.constBind, '](desc)\r\n', '\t\tset [', this.descBind, '] = desc\r\n', '\t\tSet [', this.constBind, '] = Me\r\n', '\tEnd Function\r\n'].join('');
	  },
	  generateClassName: function generateClassName() {
	    return 'VBClass' + this.classNameGenerator++;
	  },
	  parseClassConstructorName: function parseClassConstructorName(className) {
	    return className + 'Constructor';
	  },
	  generateSetter: function generateSetter(attr) {
	    var descBind = this.descBind;
	
	    return ['\tPublic Property Get [', attr, ']\r\n', '\tOn Error Resume Next\r\n', '\t\tSet[', attr, '] = [', descBind, '].get("', attr, '")\r\n', '\tIf Err.Number <> 0 Then\r\n', '\t\t[', attr, '] = [', descBind, '].get("', attr, '")\r\n', '\tEnd If\r\n', '\tOn Error Goto 0\r\n', '\tEnd Property\r\n'];
	  },
	  generateGetter: function generateGetter(attr) {
	    var descBind = this.descBind;
	
	    return ['\tPublic Property Let [', attr, '](val)\r\n', '\t\tCall [', descBind, '].set("', attr, '",val)\r\n', '\tEnd Property\r\n', '\tPublic Property Set [', attr, '](val)\r\n', '\t\tCall [', descBind, '].set("', attr, '",val)\r\n', '\tEnd Property\r\n'];
	  },
	  generateClass: function generateClass(className, props, funcMap) {
	    var _this = this;
	
	    var buffer = ['Class ', className, '\r\n', this.constScript, '\r\n'];
	
	    _.each(props, function (attr) {
	      if (funcMap[attr]) {
	        buffer.push('\tPublic [' + attr + ']\r\n');
	      } else {
	        buffer.push.apply(buffer, _this.generateSetter(attr));
	        buffer.push.apply(buffer, _this.generateGetter(attr));
	      }
	    });
	    buffer.push('End Class\r\n');
	    return buffer.join('');
	  },
	  generateClassConstructor: function generateClassConstructor(props, funcMap, funcArray) {
	    var key = [props.length, '[', props.join(','), ']', '[', funcArray.join(','), ']'].join(''),
	        classConstName = this.classPool[key];
	
	    if (classConstName) return classConstName;
	
	    var className = this.generateClassName();
	    classConstName = this.parseClassConstructorName(className);
	    parseVB(this.generateClass(className, props, funcMap));
	    parseVB(['Function ', classConstName, '(desc)\r\n', '\tDim o\r\n', '\tSet o = (New ', className, ')(desc)\r\n', '\tSet ', classConstName, ' = o\r\n', 'End Function'].join(''));
	    this.classPool[key] = classConstName;
	    return classConstName;
	  },
	  create: function create(obj, desc) {
	    var _this2 = this;
	
	    var protoProps = void 0,
	        protoPropMap = void 0,
	        props = [],
	        funcs = [],
	        funcMap = {},
	        descBind = this.descBind;
	
	    function addProp(prop) {
	      if (_.isFunc(obj[prop])) {
	        funcMap[prop] = true;
	        funcs.push(prop);
	      }
	      props.push(prop);
	    }
	
	    if (_.isArray(obj)) {
	      protoProps = this.reserveArrayProps;
	      protoPropMap = this.reserveArrayPropMap;
	    } else {
	      protoProps = this.reserveProps;
	      protoPropMap = this.reservePropMap;
	    }
	    _.each(protoProps, addProp);
	    _.each(obj, function (val, prop) {
	      if (prop !== descBind && !(prop in protoPropMap)) addProp(prop);
	    }, obj, false);
	
	    if (!desc) {
	      desc = this.descriptor(obj);
	      if (desc) {
	        obj = desc.obj;
	      } else {
	        desc = new ObjectDescriptor(obj, props, this);
	      }
	    }
	
	    proxy = window[this.generateClassConstructor(props, funcMap, funcs)](desc);
	    _.each(funcs, function (prop) {
	      proxy[prop] = _this2.funcProxy(obj[prop], proxy);
	    });
	    desc.proxy = proxy;
	    return proxy;
	  },
	  funcProxy: function funcProxy(fn, proxy) {
	    return function () {
	      fn.apply(!this || this == window ? proxy : this, arguments);
	    };
	  },
	  eq: function eq(o1, o2) {
	    var d1 = this.descriptor(o1),
	        d2 = this.descriptor(o2);
	
	    if (d1) o1 = d1.obj;
	    if (d2) o2 = d2.obj;
	    return o1 === o2;
	  },
	  obj: function obj(_obj) {
	    var desc = this.descriptor(_obj);
	
	    return desc ? desc.obj : _obj;
	  },
	  proxy: function proxy(obj) {
	    var desc = this.descriptor(obj);
	
	    return desc ? desc.proxy : undefined;
	  },
	  isProxy: function isProxy(obj) {
	    return hasOwn.call(obj, this.constBind);
	  },
	  descriptor: function descriptor(obj) {
	    var descBind = this.descBind;
	
	    return hasOwn.call(obj, descBind) ? obj[descBind] : undefined;
	  },
	  destroy: function destroy(obj) {
	    var desc = this.descriptor(obj);
	
	    if (desc) {
	      obj = desc.obj;
	      this.onProxyChange(obj, undefined);
	    }
	    return obj;
	  }
	});
	
	var ObjectDescriptor = _.dynamicClass({
	  constructor: function constructor(obj, props, classGenerator) {
	    this.classGenerator = classGenerator;
	    this.obj = obj;
	    this.defines = _.reverseConvert(props, function () {
	      return false;
	    });
	    obj[classGenerator.descBind] = this;
	    this.accessorNR = 0;
	  },
	  isAccessor: function isAccessor(desc) {
	    return desc && (desc.get || desc.set);
	  },
	  hasAccessor: function hasAccessor() {
	    return !!this.accessorNR;
	  },
	  defineProperty: function defineProperty(attr, desc) {
	    var defines = this.defines,
	        obj = this.obj;
	
	    if (!(attr in defines)) {
	      if (!(attr in obj)) {
	        obj[attr] = undefined;
	      } else if (_.isFunc(obj[attr])) {
	        console.warn('defineProperty not support function [' + attr + ']');
	      }
	      this.classGenerator.create(this.obj, this);
	    }
	
	    if (!this.isAccessor(desc)) {
	      if (defines[attr]) {
	        defines[attr] = false;
	        this.accessorNR--;
	      }
	      obj[attr] = desc.value;
	    } else {
	      defines[attr] = desc;
	      this.accessorNR++;
	      if (desc.get) obj[attr] = desc.get();
	    }
	    return this.proxy;
	  },
	  getPropertyDefine: function getPropertyDefine(attr) {
	    return this.defines[attr] || undefined;
	  },
	  get: function get(attr) {
	    var define = this.defines[attr];
	
	    return define && define.get ? define.get.call(this.proxy) : this.obj[attr];
	  },
	  set: function set(attr, value) {
	    var define = this.defines[attr];
	
	    if (define && define.set) define.set.call(this.proxy, value);
	    this.obj[attr] = value;
	  }
	});
	
	var supported = undefined;
	VBClassFactory.isSupport = function isSupport() {
	  if (supported !== undefined) return supported;
	  supported = false;
	  if (window.VBArray) {
	    try {
	      window.execScript(['Function parseVB(code)', '\tExecuteGlobal(code)', 'End Function'].join('\n'), 'VBScript');
	      supported = true;
	    } catch (e) {
	      console.error(e.message, e);
	    }
	  }
	  return supported;
	};
	module.exports = VBClassFactory;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var core = __webpack_require__(7),
	    proxy = __webpack_require__(8),
	    _ = __webpack_require__(1),
	    configuration = __webpack_require__(9);
	
	configuration.register({
	  es6Proxy: true,
	  es6SourceKey: '__ES6_PROXY_SOURCE__',
	  es6ProxyKey: '__ES6_PROXY__'
	});
	
	core.registerPolicy('ES6Proxy', 1, function (config) {
	  return window.Proxy && config.es6Proxy !== false;
	}, function (config) {
	  var es6SourceKey = config.es6SourceKey;
	  var es6ProxyKey = config.es6ProxyKey;
	
	
	  proxy.enable({
	    obj: function obj(_obj) {
	      return _obj ? _.getOwnProp(_obj, es6SourceKey) || _obj : _obj;
	    },
	    eq: function eq(o1, o2) {
	      return o1 === o2 || o1 && o2 && proxy.obj(o1) === proxy.obj(o2);
	    },
	    proxy: function proxy(obj) {
	      return obj ? _.getOwnProp(obj, es6ProxyKey) : undefined;
	    }
	  });
	
	  return {
	    _init: function _init() {
	      this.obj = proxy.obj(this.target);
	      this.es6proxy = false;
	    },
	    _destroy: function _destroy() {
	      this.es6proxy = false;
	      this.obj[es6ProxyKey] = undefined;
	      proxy.change(this.obj, undefined);
	    },
	    _watch: function _watch(attr) {
	      if (!this.es6proxy) {
	        var _proxy = this.isArray ? this._arrayProxy() : this._objectProxy(),
	            obj = this.obj;
	
	        this.target = _proxy;
	        obj[es6ProxyKey] = _proxy;
	        obj[es6SourceKey] = obj;
	        proxy.change(obj, _proxy);
	        this.es6proxy = true;
	      }
	    },
	    _unwatch: function _unwatch(attr) {},
	    _arrayProxy: function _arrayProxy() {
	      var _this = this;
	
	      var oldLength = this.target.length;
	
	      return new Proxy(this.obj, {
	        set: function set(obj, prop, value) {
	          if (_this.listens[prop]) {
	            var oldVal = void 0;
	
	            if (prop === 'length') {
	              oldVal = oldLength;
	              oldLength = value;
	            } else {
	              oldVal = obj[prop];
	            }
	            obj[prop] = value;
	            if (value !== oldVal) _this._addChangeRecord(prop, oldVal);
	          } else {
	            obj[prop] = value;
	          }
	          return true;
	        }
	      });
	    },
	    _objectProxy: function _objectProxy() {
	      var _this2 = this;
	
	      return new Proxy(this.obj, {
	        set: function set(obj, prop, value) {
	          if (_this2.listens[prop]) {
	            var oldVal = obj[prop];
	
	            obj[prop] = value;
	            if (value !== oldVal) _this2._addChangeRecord(prop, oldVal);
	          } else {
	            obj[prop] = value;
	          }
	          return true;
	        }
	      });
	    }
	  };
	});

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var core = __webpack_require__(7),
	    proxyPro = __webpack_require__(8),
	    VBClassFactory = __webpack_require__(10),
	    _ = __webpack_require__(1),
	    arrayHockMethods = ['push', 'pop', 'shift', 'unshift', 'sort', 'reverse', 'splice'],
	    policy = {
	  _init: function _init() {
	    this.watchers = {};
	  },
	  _destroy: function _destroy() {
	    for (var attr in this.watchers) {
	      if (this.watchers[attr]) this._unwatch(attr);
	    }
	    this.watchers = undefined;
	  },
	  _hockArrayLength: function _hockArrayLength(method) {
	    var self = this;
	
	    this.obj[method] = function () {
	      var len = this.length;
	
	      Array.prototype[method].apply(this, arguments);
	      if (self.obj.length != len) self._addChangeRecord('length', len);
	    };
	  },
	  _watch: function _watch(attr) {
	    var _this = this;
	
	    if (!this.watchers[attr]) {
	      if (this.isArray && attr === 'length') {
	        _.each(arrayHockMethods, function (method) {
	          _this._hockArrayLength(method);
	        });
	      } else {
	        this._defineProperty(attr, this.obj[attr]);
	      }
	      this.watchers[attr] = true;
	    }
	  },
	  _unwatch: function _unwatch(attr) {
	    var _this2 = this;
	
	    if (this.watchers[attr]) {
	      if (this.isArray && attr === 'length') {
	        _.each(arrayHockMethods, function (method) {
	          delete _this2.obj[method];
	        });
	      } else {
	        this._undefineProperty(attr, this.obj[attr]);
	      }
	      this.watchers[attr] = false;
	    }
	  }
	};
	
	core.registerPolicy('ES5DefineProperty', 10, function (config) {
	  if (Object.defineProperty) {
	    try {
	      var _ret = function () {
	        var val = void 0,
	            obj = {};
	        Object.defineProperty(obj, 'sentinel', {
	          get: function get() {
	            return val;
	          },
	          set: function set(value) {
	            val = value;
	          }
	        });
	        obj.sentinel = 1;
	        return {
	          v: obj.sentinel === val
	        };
	      }();
	
	      if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
	    } catch (e) {}
	  }
	  return false;
	}, function (config) {
	  proxyPro.disable();
	  return _.assignIf({
	    _defineProperty: function _defineProperty(attr, value) {
	      var _this3 = this;
	
	      Object.defineProperty(this.target, attr, {
	        enumerable: true,
	        configurable: true,
	        get: function get() {
	          return value;
	        },
	        set: function set(val) {
	          var oldVal = value;
	
	          value = val;
	          _this3._addChangeRecord(attr, oldVal);
	        }
	      });
	    },
	    _undefineProperty: function _undefineProperty(attr, value) {
	      Object.defineProperty(this.target, attr, {
	        enumerable: true,
	        configurable: true,
	        writable: true,
	        value: value
	      });
	    }
	  }, policy);
	});
	
	core.registerPolicy('DefineGetterAndSetter', 20, function (config) {
	  return '__defineGetter__' in {};
	}, function (config) {
	  proxyPro.disable();
	  return _.assignIf({
	    _defineProperty: function _defineProperty(attr, value) {
	      var _this4 = this;
	
	      this.target.__defineGetter__(attr, function () {
	        return value;
	      });
	      this.target.__defineSetter__(attr, function (val) {
	        var oldVal = value;
	
	        value = val;
	        _this4._addChangeRecord(attr, oldVal);
	      });
	    },
	    _undefineProperty: function _undefineProperty(attr, value) {
	      this.target.__defineGetter__(attr, function () {
	        return value;
	      });
	      this.target.__defineSetter__(attr, function (val) {
	        value = val;
	      });
	    }
	  }, policy);
	});
	
	core.registerPolicy('VBScriptProxy', 30, function (config) {
	  return VBClassFactory.isSupport();
	}, function (config) {
	  var init = policy._init,
	      factory = core.vbfactory = new VBClassFactory([proxyPro.listenKey, config.observerKey, config.expressionKey], proxyPro.change);
	
	  proxyPro.enable({
	    obj: function obj(_obj) {
	      return _obj ? factory.obj(_obj) : _obj;
	    },
	    eq: function eq(o1, o2) {
	      return o1 === o2 || o1 && o2 && factory.obj(o1) === factory.obj(o2);
	    },
	    proxy: function proxy(obj) {
	      return obj ? factory.proxy(obj) : undefined;
	    }
	  });
	
	  return _.assignIf({
	    _init: function _init() {
	      init.call(this);
	      this.obj = factory.obj(this.target);
	    },
	    _defineProperty: function _defineProperty(attr, value) {
	      var _this5 = this;
	
	      var obj = this.obj,
	          desc = factory.descriptor(obj);
	
	      if (!desc) desc = factory.descriptor(factory.create(obj));
	
	      this.target = desc.defineProperty(attr, {
	        set: function set(val) {
	          var oldVal = _this5.obj[attr];
	          _this5.obj[attr] = val;
	          _this5._addChangeRecord(attr, oldVal);
	        }
	      });
	    },
	    _undefineProperty: function _undefineProperty(attr, value) {
	      var obj = this.obj,
	          desc = factory.descriptor(obj);
	
	      if (desc) {
	        this.target = desc.defineProperty(attr, {
	          value: value
	        });
	        if (!desc.hasAccessor()) {
	          this.target = factory.destroy(obj);
	        }
	      }
	    }
	  }, policy);
	});

/***/ }
/******/ ])
});
;
//# sourceMappingURL=observer.all.js.map