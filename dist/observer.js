(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("_"));
	else if(typeof define === 'function' && define.amd)
		define(["_"], factory);
	else if(typeof exports === 'object')
		exports["observer"] = factory(require("_"));
	else
		root["observer"] = factory(root["_"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_58__) {
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
	
	var _classCallCheck = __webpack_require__(1)['default'];
	
	var _Map = __webpack_require__(2)['default'];
	
	var _Object$defineProperty = __webpack_require__(56)['default'];
	
	var _ = __webpack_require__(58),
	    ARRAY_METHODS = ['push', 'pop', 'shift', 'unshift', 'sort', 'reverse', 'splice'];
	var _observers = new _Map();
	
	function bindObserver(observer) {
	  if (observer._binded !== true) {
	    _observers.set(observer.target, observer);
	    observer._binded = true;
	  }
	}
	
	function unbindObserver(observer) {
	  if (observer._binded === true) {
	    _observers['delete'](observer.target, observer);
	    observer._binded = false;
	  }
	}
	
	function getBindObserver(target) {
	  return _observers.get(target);
	}
	
	function isBind(observer) {
	  return observer._binded;
	}
	
	var Observer = (function () {
	  function Observer(target, history) {
	    _classCallCheck(this, Observer);
	
	    if (!_.isArray(target) || !_.isObject(target)) {
	      throw TypeError('can not observe object[' + typeof target + ']');
	    }
	    this.target = target;
	    this.listens = [];
	    this.attrListens = {};
	    this.watchers = {};
	    this.history = _.isNumber(history) ? history : 0;
	    bindObserver(this);
	  }
	
	  Observer.attrArg = function attrArg(attr) {
	    if (_.isUndefined(attr) || _.isNull(attr)) {
	      attr = _.keys(this.target);
	    } else if (!_.isArray(attr)) {
	      attr = [attr];
	    }
	    return attr;
	  };
	
	  Observer.handlerArg = function handlerArg(handler) {
	    if (!_.isArray(handler)) {
	      handler = [handler];
	    }
	    handler = _.filter(hander, function (h) {
	      return _.isFunction(h);
	    });
	    return handler;
	  };
	
	  Observer.prototype._onChanged = function _onChanged(attr, state, oldVal) {
	    var _this = this;
	
	    _.each(state.handlers, function (handler) {
	      handler(attr, state.value, oldValue, _this.target, state.history);
	    });
	  };
	
	  Observer.prototype._watch = function _watch(attr, handler) {
	    var _this2 = this;
	
	    handler = Observer.handlerArg(handler);
	    if (handler.length == 0) {
	      return;
	    }
	    var state = this.watchers[attr];
	    if (state) {
	      _.each(handler, function (h) {
	        if (!_.include(state.handlers, h)) {
	          state.handlers.push(h);
	        }
	      });
	      return;
	    }
	    state = this.watchers[attr] = {
	      value: this.target[attr],
	      history: [],
	      handlers: handler
	    };
	    state.value = this.target[attr];
	    _Object$defineProperty(this.target, attr, {
	      get: function get() {
	        return state.value;
	      },
	      set: function set(value) {
	        var oldValue = state.value;
	        if (value !== oldValue) {
	          state.value = value;
	          if (_this2.history > 0) {
	            state.history.splice(0, 0, oldValue);
	            if (state.history.length > _this2.history) {
	              state.history.splice(_this2.history, state.history.length - 1 - _this2.history);
	            }
	          }
	          _this2._onChanged(attr, state, oldValue);
	        }
	      }
	    });
	  };
	
	  Observer.prototype._unwatch = function _unwatch(attr, handler) {
	    var state = this.watchers[attr];
	    if (state) {
	      handler = Observer.handlerArg(handler);
	      if (handler.length > 0) {
	        _.remove(state.handlers, function (h) {
	          return _.include(handler, h);
	        });
	        if (state.handlers.length == 0) {
	          _Object$defineProperty(this.target, attr, {
	            value: state.value
	          });
	        }
	      }
	    }
	  };
	
	  Observer.prototype.getHistory = function getHistory(attr) {
	    var state = this.watchers[attr];
	    return state ? state.history : [];
	  };
	
	  Observer.prototype.on = function on(attr, handler) {
	    if (_.isFunction(attr)) {
	      handler = attr;
	      attr = undefined;
	    }
	    attr = Observer.attrArg(attr);
	    if (attr.length = 0) {
	      return;
	    }
	  };
	
	  Observer.prototype.un = function un(attr, handler) {};
	
	  Observer.prototype.destory = function destory() {
	    var _this3 = this;
	
	    _.map(this.watchers, function (state, attr) {
	      _this3._unwatch(attr);
	    });
	    this.watchers = {};
	    unbindObserver(this);
	  };
	
	  return Observer;
	})();
	
	module.exports = Observer;

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	
	exports["default"] = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};
	
	exports.__esModule = true;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	module.exports = { "default": __webpack_require__(3), __esModule: true };

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(4);
	__webpack_require__(5);
	__webpack_require__(27);
	__webpack_require__(34);
	__webpack_require__(54);
	module.exports = __webpack_require__(13).Map;

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $at = __webpack_require__(6)(true);
	
	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(9)(String, 'String', function (iterated) {
	  this._t = String(iterated); // target
	  this._i = 0; // next index
	  // 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function () {
	  var O = this._t,
	      index = this._i,
	      point;
	  if (index >= O.length) return { value: undefined, done: true };
	  point = $at(O, index);
	  this._i += point.length;
	  return { value: point, done: false };
	});

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	// true  -> String#at
	// false -> String#codePointAt
	'use strict';
	
	var toInteger = __webpack_require__(7),
	    defined = __webpack_require__(8);
	module.exports = function (TO_STRING) {
	  return function (that, pos) {
	    var s = String(defined(that)),
	        i = toInteger(pos),
	        l = s.length,
	        a,
	        b;
	    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff ? TO_STRING ? s.charAt(i) : a : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

/***/ },
/* 7 */
/***/ function(module, exports) {

	// 7.1.4 ToInteger
	"use strict";
	
	var ceil = Math.ceil,
	    floor = Math.floor;
	module.exports = function (it) {
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ },
/* 8 */
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	"use strict";
	
	module.exports = function (it) {
	  if (it == undefined) throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY = __webpack_require__(10),
	    $def = __webpack_require__(11),
	    $redef = __webpack_require__(14),
	    hide = __webpack_require__(15),
	    has = __webpack_require__(20),
	    SYMBOL_ITERATOR = __webpack_require__(21)('iterator'),
	    Iterators = __webpack_require__(24),
	    BUGGY = !([].keys && 'next' in [].keys()),
	    // Safari has buggy iterators w/o `next`
	FF_ITERATOR = '@@iterator',
	    KEYS = 'keys',
	    VALUES = 'values';
	var returnThis = function returnThis() {
	  return this;
	};
	module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCE) {
	  __webpack_require__(25)(Constructor, NAME, next);
	  var createMethod = function createMethod(kind) {
	    switch (kind) {
	      case KEYS:
	        return function keys() {
	          return new Constructor(this, kind);
	        };
	      case VALUES:
	        return function values() {
	          return new Constructor(this, kind);
	        };
	    }return function entries() {
	      return new Constructor(this, kind);
	    };
	  };
	  var TAG = NAME + ' Iterator',
	      proto = Base.prototype,
	      _native = proto[SYMBOL_ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT],
	      _default = _native || createMethod(DEFAULT),
	      methods,
	      key;
	  // Fix native
	  if (_native) {
	    var IteratorPrototype = __webpack_require__(16).getProto(_default.call(new Base()));
	    // Set @@toStringTag to native iterators
	    __webpack_require__(26)(IteratorPrototype, TAG, true);
	    // FF fix
	    if (!LIBRARY && has(proto, FF_ITERATOR)) hide(IteratorPrototype, SYMBOL_ITERATOR, returnThis);
	  }
	  // Define iterator
	  if (!LIBRARY || FORCE) hide(proto, SYMBOL_ITERATOR, _default);
	  // Plug for library
	  Iterators[NAME] = _default;
	  Iterators[TAG] = returnThis;
	  if (DEFAULT) {
	    methods = {
	      keys: IS_SET ? _default : createMethod(KEYS),
	      values: DEFAULT == VALUES ? _default : createMethod(VALUES),
	      entries: DEFAULT != VALUES ? _default : createMethod('entries')
	    };
	    if (FORCE) for (key in methods) {
	      if (!(key in proto)) $redef(proto, key, methods[key]);
	    } else $def($def.P + $def.F * BUGGY, NAME, methods);
	  }
	};

/***/ },
/* 10 */
/***/ function(module, exports) {

	"use strict";
	
	module.exports = true;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var global = __webpack_require__(12),
	    core = __webpack_require__(13),
	    PROTOTYPE = 'prototype';
	var ctx = function ctx(fn, that) {
	  return function () {
	    return fn.apply(that, arguments);
	  };
	};
	var $def = function $def(type, name, source) {
	  var key,
	      own,
	      out,
	      exp,
	      isGlobal = type & $def.G,
	      isProto = type & $def.P,
	      target = isGlobal ? global : type & $def.S ? global[name] : (global[name] || {})[PROTOTYPE],
	      exports = isGlobal ? core : core[name] || (core[name] = {});
	  if (isGlobal) source = name;
	  for (key in source) {
	    // contains in native
	    own = !(type & $def.F) && target && key in target;
	    if (own && key in exports) continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    if (isGlobal && typeof target[key] != 'function') exp = source[key];
	    // bind timers to global for call from export context
	    else if (type & $def.B && own) exp = ctx(out, global);
	      // wrap global constructors for prevent change them in library
	      else if (type & $def.W && target[key] == out) !(function (C) {
	          exp = function (param) {
	            return this instanceof C ? new C(param) : C(param);
	          };
	          exp[PROTOTYPE] = C[PROTOTYPE];
	        })(out);else exp = isProto && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // export
	    exports[key] = exp;
	    if (isProto) (exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
	  }
	};
	// type bitmap
	$def.F = 1; // forced
	$def.G = 2; // global
	$def.S = 4; // static
	$def.P = 8; // proto
	$def.B = 16; // bind
	$def.W = 32; // wrap
	module.exports = $def;

/***/ },
/* 12 */
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	'use strict';
	
	var UNDEFINED = 'undefined';
	var global = module.exports = typeof window != UNDEFINED && window.Math == Math ? window : typeof self != UNDEFINED && self.Math == Math ? self : Function('return this')();
	if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';
	
	var core = module.exports = {};
	if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = __webpack_require__(15);

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var $ = __webpack_require__(16),
	    createDesc = __webpack_require__(17);
	module.exports = __webpack_require__(18) ? function (object, key, value) {
	  return $.setDesc(object, key, createDesc(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

/***/ },
/* 16 */
/***/ function(module, exports) {

	"use strict";
	
	var $Object = Object;
	module.exports = {
	  create: $Object.create,
	  getProto: $Object.getPrototypeOf,
	  isEnum: ({}).propertyIsEnumerable,
	  getDesc: $Object.getOwnPropertyDescriptor,
	  setDesc: $Object.defineProperty,
	  setDescs: $Object.defineProperties,
	  getKeys: $Object.keys,
	  getNames: $Object.getOwnPropertyNames,
	  getSymbols: $Object.getOwnPropertySymbols,
	  each: [].forEach
	};

/***/ },
/* 17 */
/***/ function(module, exports) {

	"use strict";
	
	module.exports = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	'use strict';
	
	module.exports = !__webpack_require__(19)(function () {
	  return Object.defineProperty({}, 'a', { get: function get() {
	      return 7;
	    } }).a != 7;
	});

/***/ },
/* 19 */
/***/ function(module, exports) {

	"use strict";
	
	module.exports = function (exec) {
	  try {
	    return !!exec();
	  } catch (e) {
	    return true;
	  }
	};

/***/ },
/* 20 */
/***/ function(module, exports) {

	"use strict";
	
	var hasOwnProperty = ({}).hasOwnProperty;
	module.exports = function (it, key) {
	  return hasOwnProperty.call(it, key);
	};

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var store = __webpack_require__(22)('wks'),
	    Symbol = __webpack_require__(12).Symbol;
	module.exports = function (name) {
	  return store[name] || (store[name] = Symbol && Symbol[name] || (Symbol || __webpack_require__(23))('Symbol.' + name));
	};

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var global = __webpack_require__(12),
	    SHARED = '__core-js_shared__',
	    store = global[SHARED] || (global[SHARED] = {});
	module.exports = function (key) {
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 23 */
/***/ function(module, exports) {

	'use strict';
	
	var id = 0,
	    px = Math.random();
	module.exports = function (key) {
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ },
/* 24 */
/***/ function(module, exports) {

	"use strict";
	
	module.exports = {};

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $ = __webpack_require__(16),
	    IteratorPrototype = {};
	
	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(15)(IteratorPrototype, __webpack_require__(21)('iterator'), function () {
	  return this;
	});
	
	module.exports = function (Constructor, NAME, next) {
	  Constructor.prototype = $.create(IteratorPrototype, { next: __webpack_require__(17)(1, next) });
	  __webpack_require__(26)(Constructor, NAME + ' Iterator');
	};

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var has = __webpack_require__(20),
	    hide = __webpack_require__(15),
	    TAG = __webpack_require__(21)('toStringTag');
	
	module.exports = function (it, tag, stat) {
	  if (it && !has(it = stat ? it : it.prototype, TAG)) hide(it, TAG, tag);
	};

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(28);
	var Iterators = __webpack_require__(24);
	Iterators.NodeList = Iterators.HTMLCollection = Iterators.Array;

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var setUnscope = __webpack_require__(29),
	    step = __webpack_require__(30),
	    Iterators = __webpack_require__(24),
	    toIObject = __webpack_require__(31);
	
	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	__webpack_require__(9)(Array, 'Array', function (iterated, kind) {
	  this._t = toIObject(iterated); // target
	  this._i = 0; // next index
	  this._k = kind; // kind
	  // 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function () {
	  var O = this._t,
	      kind = this._k,
	      index = this._i++;
	  if (!O || index >= O.length) {
	    this._t = undefined;
	    return step(1);
	  }
	  if (kind == 'keys') return step(0, index);
	  if (kind == 'values') return step(0, O[index]);
	  return step(0, [index, O[index]]);
	}, 'values');
	
	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators.Arguments = Iterators.Array;
	
	setUnscope('keys');
	setUnscope('values');
	setUnscope('entries');

/***/ },
/* 29 */
/***/ function(module, exports) {

	"use strict";
	
	module.exports = function () {/* empty */};

/***/ },
/* 30 */
/***/ function(module, exports) {

	"use strict";
	
	module.exports = function (done, value) {
	  return { value: value, done: !!done };
	};

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	'use strict';
	
	var IObject = __webpack_require__(32),
	    defined = __webpack_require__(8);
	module.exports = function (it) {
	  return IObject(defined(it));
	};

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	// indexed object, fallback for non-array-like ES3 strings
	'use strict';
	
	var cof = __webpack_require__(33);
	module.exports = 0 in Object('z') ? Object : function (it) {
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 33 */
/***/ function(module, exports) {

	"use strict";
	
	var toString = ({}).toString;
	
	module.exports = function (it) {
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var strong = __webpack_require__(35);
	
	// 23.1 Map Objects
	__webpack_require__(53)('Map', function (get) {
	  return function Map() {
	    return get(this, arguments[0]);
	  };
	}, {
	  // 23.1.3.6 Map.prototype.get(key)
	  get: function get(key) {
	    var entry = strong.getEntry(this, key);
	    return entry && entry.v;
	  },
	  // 23.1.3.9 Map.prototype.set(key, value)
	  set: function set(key, value) {
	    return strong.def(this, key === 0 ? 0 : key, value);
	  }
	}, strong, true);

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _Object$isExtensible = __webpack_require__(36)['default'];
	
	var $ = __webpack_require__(16),
	    hide = __webpack_require__(15),
	    ctx = __webpack_require__(41),
	    species = __webpack_require__(43),
	    strictNew = __webpack_require__(44),
	    defined = __webpack_require__(8),
	    forOf = __webpack_require__(45),
	    step = __webpack_require__(30),
	    ID = __webpack_require__(23)('id'),
	    $has = __webpack_require__(20),
	    isObject = __webpack_require__(39),
	    isExtensible = _Object$isExtensible || isObject,
	    SUPPORT_DESC = __webpack_require__(18),
	    SIZE = SUPPORT_DESC ? '_s' : 'size',
	    id = 0;
	
	var fastKey = function fastKey(it, create) {
	  // return primitive with prefix
	  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if (!$has(it, ID)) {
	    // can't set id to frozen object
	    if (!isExtensible(it)) return 'F';
	    // not necessary to add id
	    if (!create) return 'E';
	    // add missing object id
	    hide(it, ID, ++id);
	    // return object id with prefix
	  }return 'O' + it[ID];
	};
	
	var getEntry = function getEntry(that, key) {
	  // fast case
	  var index = fastKey(key),
	      entry;
	  if (index !== 'F') return that._i[index];
	  // frozen object case
	  for (entry = that._f; entry; entry = entry.n) {
	    if (entry.k == key) return entry;
	  }
	};
	
	module.exports = {
	  getConstructor: function getConstructor(wrapper, NAME, IS_MAP, ADDER) {
	    var C = wrapper(function (that, iterable) {
	      strictNew(that, C, NAME);
	      that._i = $.create(null); // index
	      that._f = undefined; // first entry
	      that._l = undefined; // last entry
	      that[SIZE] = 0; // size
	      if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
	    });
	    __webpack_require__(52)(C.prototype, {
	      // 23.1.3.1 Map.prototype.clear()
	      // 23.2.3.2 Set.prototype.clear()
	      clear: function clear() {
	        for (var that = this, data = that._i, entry = that._f; entry; entry = entry.n) {
	          entry.r = true;
	          if (entry.p) entry.p = entry.p.n = undefined;
	          delete data[entry.i];
	        }
	        that._f = that._l = undefined;
	        that[SIZE] = 0;
	      },
	      // 23.1.3.3 Map.prototype.delete(key)
	      // 23.2.3.4 Set.prototype.delete(value)
	      'delete': function _delete(key) {
	        var that = this,
	            entry = getEntry(that, key);
	        if (entry) {
	          var next = entry.n,
	              prev = entry.p;
	          delete that._i[entry.i];
	          entry.r = true;
	          if (prev) prev.n = next;
	          if (next) next.p = prev;
	          if (that._f == entry) that._f = next;
	          if (that._l == entry) that._l = prev;
	          that[SIZE]--;
	        }return !!entry;
	      },
	      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
	      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
	      forEach: function forEach(callbackfn /*, that = undefined */) {
	        var f = ctx(callbackfn, arguments[1], 3),
	            entry;
	        while (entry = entry ? entry.n : this._f) {
	          f(entry.v, entry.k, this);
	          // revert to the last existing entry
	          while (entry && entry.r) entry = entry.p;
	        }
	      },
	      // 23.1.3.7 Map.prototype.has(key)
	      // 23.2.3.7 Set.prototype.has(value)
	      has: function has(key) {
	        return !!getEntry(this, key);
	      }
	    });
	    if (SUPPORT_DESC) $.setDesc(C.prototype, 'size', {
	      get: function get() {
	        return defined(this[SIZE]);
	      }
	    });
	    return C;
	  },
	  def: function def(that, key, value) {
	    var entry = getEntry(that, key),
	        prev,
	        index;
	    // change existing entry
	    if (entry) {
	      entry.v = value;
	      // create new entry
	    } else {
	        that._l = entry = {
	          i: index = fastKey(key, true), // <- index
	          k: key, // <- key
	          v: value, // <- value
	          p: prev = that._l, // <- previous entry
	          n: undefined, // <- next entry
	          r: false // <- removed
	        };
	        if (!that._f) that._f = entry;
	        if (prev) prev.n = entry;
	        that[SIZE]++;
	        // add to index
	        if (index !== 'F') that._i[index] = entry;
	      }return that;
	  },
	  getEntry: getEntry,
	  setStrong: function setStrong(C, NAME, IS_MAP) {
	    // add .keys, .values, .entries, [@@iterator]
	    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
	    __webpack_require__(9)(C, NAME, function (iterated, kind) {
	      this._t = iterated; // target
	      this._k = kind; // kind
	      this._l = undefined; // previous
	    }, function () {
	      var that = this,
	          kind = that._k,
	          entry = that._l;
	      // revert to the last existing entry
	      while (entry && entry.r) entry = entry.p;
	      // get next entry
	      if (!that._t || !(that._l = entry = entry ? entry.n : that._t._f)) {
	        // or finish the iteration
	        that._t = undefined;
	        return step(1);
	      }
	      // return step by kind
	      if (kind == 'keys') return step(0, entry.k);
	      if (kind == 'values') return step(0, entry.v);
	      return step(0, [entry.k, entry.v]);
	    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);
	
	    // add [@@species], 23.1.2.2, 23.2.2.2
	    species(C);
	    species(__webpack_require__(13)[NAME]); // for wrapper
	  }
	};

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	module.exports = { "default": __webpack_require__(37), __esModule: true };

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(38);
	module.exports = __webpack_require__(13).Object.isExtensible;

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.11 Object.isExtensible(O)
	'use strict';
	
	var isObject = __webpack_require__(39);
	
	__webpack_require__(40)('isExtensible', function ($isExtensible) {
	  return function isExtensible(it) {
	    return isObject(it) ? $isExtensible ? $isExtensible(it) : true : false;
	  };
	});

/***/ },
/* 39 */
/***/ function(module, exports) {

	// http://jsperf.com/core-js-isobject
	'use strict';
	
	module.exports = function (it) {
	  return it !== null && (typeof it == 'object' || typeof it == 'function');
	};

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	// most Object methods by ES6 should accept primitives
	'use strict';
	
	module.exports = function (KEY, exec) {
	  var $def = __webpack_require__(11),
	      fn = (__webpack_require__(13).Object || {})[KEY] || Object[KEY],
	      exp = {};
	  exp[KEY] = exec(fn);
	  $def($def.S + $def.F * __webpack_require__(19)(function () {
	    fn(1);
	  }), 'Object', exp);
	};

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	'use strict';
	
	var aFunction = __webpack_require__(42);
	module.exports = function (fn, that, length) {
	  aFunction(fn);
	  if (that === undefined) return fn;
	  switch (length) {
	    case 1:
	      return function (a) {
	        return fn.call(that, a);
	      };
	    case 2:
	      return function (a, b) {
	        return fn.call(that, a, b);
	      };
	    case 3:
	      return function (a, b, c) {
	        return fn.call(that, a, b, c);
	      };
	  }return function () /* ...args */{
	    return fn.apply(that, arguments);
	  };
	};

/***/ },
/* 42 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = function (it) {
	  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $ = __webpack_require__(16),
	    SPECIES = __webpack_require__(21)('species');
	module.exports = function (C) {
	  if (__webpack_require__(18) && !(SPECIES in C)) $.setDesc(C, SPECIES, {
	    configurable: true,
	    get: function get() {
	      return this;
	    }
	  });
	};

/***/ },
/* 44 */
/***/ function(module, exports) {

	"use strict";
	
	module.exports = function (it, Constructor, name) {
	  if (!(it instanceof Constructor)) throw TypeError(name + ": use the 'new' operator!");
	  return it;
	};

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var ctx = __webpack_require__(41),
	    call = __webpack_require__(46),
	    isArrayIter = __webpack_require__(48),
	    anObject = __webpack_require__(47),
	    toLength = __webpack_require__(49),
	    getIterFn = __webpack_require__(50);
	module.exports = function (iterable, entries, fn, that) {
	  var iterFn = getIterFn(iterable),
	      f = ctx(fn, that, entries ? 2 : 1),
	      index = 0,
	      length,
	      step,
	      iterator;
	  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
	  // fast case for arrays with default iterator
	  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
	    entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
	  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
	    call(iterator, f, step.value, entries);
	  }
	};

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	// call something on iterator step with safe closing on error
	'use strict';
	
	var anObject = __webpack_require__(47);
	module.exports = function (iterator, fn, value, entries) {
	  try {
	    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
	    // 7.4.6 IteratorClose(iterator, completion)
	  } catch (e) {
	    var ret = iterator['return'];
	    if (ret !== undefined) anObject(ret.call(iterator));
	    throw e;
	  }
	};

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var isObject = __webpack_require__(39);
	module.exports = function (it) {
	  if (!isObject(it)) throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	// check on default Array iterator
	'use strict';
	
	var Iterators = __webpack_require__(24),
	    ITERATOR = __webpack_require__(21)('iterator');
	module.exports = function (it) {
	  return (Iterators.Array || Array.prototype[ITERATOR]) === it;
	};

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	'use strict';
	
	var toInteger = __webpack_require__(7),
	    min = Math.min;
	module.exports = function (it) {
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var classof = __webpack_require__(51),
	    ITERATOR = __webpack_require__(21)('iterator'),
	    Iterators = __webpack_require__(24);
	module.exports = __webpack_require__(13).getIteratorMethod = function (it) {
	  if (it != undefined) return it[ITERATOR] || it['@@iterator'] || Iterators[classof(it)];
	};

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	// getting tag from 19.1.3.6 Object.prototype.toString()
	'use strict';
	
	var cof = __webpack_require__(33),
	    TAG = __webpack_require__(21)('toStringTag'),
	
	// ES3 wrong here
	ARG = cof((function () {
	  return arguments;
	})()) == 'Arguments';
	
	module.exports = function (it) {
	  var O, T, B;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	  // @@toStringTag case
	  : typeof (T = (O = Object(it))[TAG]) == 'string' ? T
	  // builtinTag case
	  : ARG ? cof(O)
	  // ES3 arguments fallback
	  : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
	};

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var $redef = __webpack_require__(14);
	module.exports = function (target, src) {
	  for (var key in src) $redef(target, key, src[key]);
	  return target;
	};

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $ = __webpack_require__(16),
	    $def = __webpack_require__(11),
	    hide = __webpack_require__(15),
	    forOf = __webpack_require__(45),
	    strictNew = __webpack_require__(44);
	
	module.exports = function (NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
	  var Base = __webpack_require__(12)[NAME],
	      C = Base,
	      ADDER = IS_MAP ? 'set' : 'add',
	      proto = C && C.prototype,
	      O = {};
	  if (!__webpack_require__(18) || typeof C != 'function' || !(IS_WEAK || proto.forEach && !__webpack_require__(19)(function () {
	    new C().entries().next();
	  }))) {
	    // create collection constructor
	    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
	    __webpack_require__(52)(C.prototype, methods);
	  } else {
	    C = wrapper(function (target, iterable) {
	      strictNew(target, C, NAME);
	      target._c = new Base();
	      if (iterable != undefined) forOf(iterable, IS_MAP, target[ADDER], target);
	    });
	    $.each.call('add,clear,delete,forEach,get,has,set,keys,values,entries'.split(','), function (KEY) {
	      var chain = KEY == 'add' || KEY == 'set';
	      if (KEY in proto && !(IS_WEAK && KEY == 'clear')) hide(C.prototype, KEY, function (a, b) {
	        var result = this._c[KEY](a === 0 ? 0 : a, b);
	        return chain ? this : result;
	      });
	    });
	    if ('size' in proto) $.setDesc(C.prototype, 'size', {
	      get: function get() {
	        return this._c.size;
	      }
	    });
	  }
	
	  __webpack_require__(26)(C, NAME);
	
	  O[NAME] = C;
	  $def($def.G + $def.W + $def.F, O);
	
	  if (!IS_WEAK) common.setStrong(C, NAME, IS_MAP);
	
	  return C;
	};

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	// https://github.com/DavidBruant/Map-Set.prototype.toJSON
	'use strict';
	
	var $def = __webpack_require__(11);
	
	$def($def.P, 'Map', { toJSON: __webpack_require__(55)('Map') });

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	// https://github.com/DavidBruant/Map-Set.prototype.toJSON
	'use strict';
	
	var forOf = __webpack_require__(45),
	    classof = __webpack_require__(51);
	module.exports = function (NAME) {
	  return function toJSON() {
	    if (classof(this) != NAME) throw TypeError(NAME + "#toJSON isn't generic");
	    var arr = [];
	    forOf(this, false, arr.push, arr);
	    return arr;
	  };
	};

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	module.exports = { "default": __webpack_require__(57), __esModule: true };

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var $ = __webpack_require__(16);
	module.exports = function defineProperty(it, key, desc) {
	  return $.setDesc(it, key, desc);
	};

/***/ },
/* 58 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_58__;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=observer.js.map