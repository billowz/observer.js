/*
 * observer.js v0.4.0 built in Wed, 28 Sep 2016 08:19:26 GMT
 * Copyright (c) 2016 Tao Zeng <tao.zeng.zt@gmail.com>
 * Released under the MIT license
 * support IE6+ and other browsers
 * https://github.com/tao-zeng/observer.js
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define('observer', factory) :
  (global.observer = factory());
}(this, function () {

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

  var timeoutframe = {
    request: request,
    cancel: cancel
  };

  window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || timeoutframe.request;

  window.cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame || timeoutframe.cancel;

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

  if (!Object.freeze) Object.freeze = function freeze(obj) {
    return obj;
  };

  var toStr = Object.prototype.toString;
  var hasOwn = Object.prototype.hasOwnProperty;
  var policies = {
    hasOwn: function (obj, prop) {
      return hasOwn.call(obj, prop);
    },
    eq: function (o1, o2) {
      return o1 === o2;
    }
  };
  function overridePolicy(name, policy) {
    policies[name] = policy;
  }

  function policy(name) {
    return policies[name];
  }

  function eq(o1, o2) {
    return policies.eq(o1, o2);
  }

  function hasOwnProp(o1, o2) {
    return policies.hasOwn(o1, o2);
  }

  // ==============================================
  // type utils
  // ==============================================
  var argsType = '[object Arguments]';
  var arrayType = '[object Array]';
  var funcType = '[object Function]';
  var boolType = '[object Boolean]';
  var numberType = '[object Number]';
  var dateType = '[object Date]';
  var stringType = '[object String]';
  var objectType = '[object Object]';
  var regexpType = '[object RegExp]';
  var nodeListType = '[object NodeList]';
  function isPrimitive(obj) {
    if (obj === null || obj === undefined) return true;
    var type = toStr.call(obj);
    switch (type) {
      case boolType:
      case numberType:
      case stringType:
      case funcType:
        return true;
    }
    return false;
  }

  function isDefine(obj) {
    return obj !== undefined;
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
          return isNumber(length) && (length ? length > 0 && length - 1 in obj : length === 0);
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

  function each$1(obj, callback, scope, own) {
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

    each$1(obj, function (val, key, obj, isOwn) {
      rs = callback.call(this, rs, val, key, obj, isOwn);
    }, scope, own);
    return rs;
  }

  function keys(obj, filter, scope, own) {
    var keys = [];

    each$1(obj, function (val, key) {
      if (!filter || filter.apply(this, arguments)) keys.push(key);
    }, scope, own);
    return keys;
  }

  function values(obj, filter, scope, own) {
    var values = [];

    each$1(obj, function (val, key) {
      if (!filter || filter.apply(this, arguments)) values.push(val);
    }, scope, own);
    return values;
  }

  function _indexOfArray(array, val) {
    var i = 0,
        l = array.length;

    for (; i < l; i++) {
      if (eq(array[i], val)) return i;
    }
    return -1;
  }

  function _lastIndexOfArray(array, val) {
    var i = array.length;

    while (i-- > 0) {
      if (eq(array[i], val)) return i;
    }
  }

  function _indexOfObj(obj, val, own) {
    for (key in obj) {
      if (own === false || hasOwnProp(obj, key)) {
        if (eq(obj[key], val)) return key;
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

    each$1(obj, function (val, key) {
      o[keyGen ? keyGen.apply(this, arguments) : key] = valGen ? valGen.apply(this, arguments) : val;
    }, scope, own);
    return o;
  }

  function reverseConvert(obj, valGen, scope, own) {
    var o = {};

    each$1(obj, function (val, key) {
      o[val] = valGen ? valGen.apply(this, arguments) : key;
    }, scope, own);
    return o;
  }

  // ==============================================
  // string utils
  // ==============================================
  var regFirstChar = /^[a-z]/;
  var regLeftTrim = /^\s+/;
  var regRightTrim = /\s+$/;
  var regTrim = /(^\s+)|(\s+$)/g;
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

  var thousandSeparationReg = /(\d)(?=(\d{3})+(?!\d))/g;

  function thousandSeparate(number) {
    var split = (number + '').split('.');
    split[0] = split[0].replace(thousandSeparationReg, '$1,');
    return split.join('.');
  }

  var plurals = [{
    reg: /([a-zA-Z]+[^aeiou])y$/,
    rep: '$1ies'
  }, {
    reg: /([a-zA-Z]+[aeiou]y)$/,
    rep: '$1s'
  }, {
    reg: /([a-zA-Z]+[sxzh])$/,
    rep: '$1es'
  }, {
    reg: /([a-zA-Z]+[^sxzhy])$/,
    rep: '$1s'
  }];
  var singulars = [{
    reg: /([a-zA-Z]+[^aeiou])ies$/,
    rep: '$1y'
  }, {
    reg: /([a-zA-Z]+[aeiou])s$/,
    rep: '$1'
  }, {
    reg: /([a-zA-Z]+[sxzh])es$/,
    rep: '$1'
  }, {
    reg: /([a-zA-Z]+[^sxzhy])s$/,
    rep: '$1'
  }];
  function plural(str) {
    var plural = void 0;
    for (var i = 0; i < 4; i++) {
      plural = plurals[i];
      if (plural.reg.test(str)) return str.replace(plural.reg, plural.rep);
    }
    return str;
  }
  function singular(str) {
    var singular = void 0;
    for (var i = 0; i < 4; i++) {
      singular = singulars[i];
      if (singular.reg.test(str)) return str.replace(singular.reg, singular.rep);
    }
    return str;
  }
  // ==============================================
  // object utils
  // ==============================================
  var exprCache = {};
  var regPropertyName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;
  var regEscapeChar = /\\(\\)?/g;
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

      if (typeof _ret === "object") return _ret.v;
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
      if (isNil(_obj[prop])) {
        _obj = _obj[prop] = {};
      } else {
        _obj = _obj[prop];
      }
      prop = path[i + 1];
    }
    _obj[prop] = value;
    return obj;
  }

  function getOwnProp(obj, key) {
    return hasOwnProp(obj, key) ? obj[key] : undefined;
  }

  var prototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function getPrototypeOf(obj) {
    return obj.__proto__;
  };

  var setPrototypeOf = Object.setPrototypeOf || function setPrototypeOf(obj, proto) {
    obj.__proto__ = proto;
  };

  var assign = Object.assign || function assign(target) {
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

  var create = Object.create || function (parent, props) {
    emptyFunc.prototype = parent;
    var obj = new emptyFunc();
    emptyFunc.prototype = undefined;
    if (props) each$1(props, function (prop, name) {
      obj[name] = prop.value;
    });
    return obj;
  };

  function isExtendOf(cls, parent) {
    if (!isFunc(cls)) return cls instanceof parent;

    var proto = cls;

    while ((proto = prototypeOf(proto)) && proto !== Object) {
      if (proto === parent) return true;
    }
    return parent === Object;
  }

  // ==============================================
  // dynamicClass
  // ==============================================
  var Base = function () {};
  var emptyArray = [];
  assign(Base.prototype, {
    'super': function (args) {
      var method = arguments.callee.caller;
      method.$owner.superclass[method.$name].apply(this, args || emptyArray);
    },
    superclass: function () {
      var method = arguments.callee.caller;
      return method.$owner.superclass;
    }
  });
  assign(Base, {
    extend: function (overrides) {
      var _this = this;

      if (overrides) {
        var proto = this.prototype;
        each$1(overrides, function (member, name) {
          if (isFunc(member)) {
            member.$owner = _this;
            member.$name = name;
          }
          proto[name] = member;
        });
        this.assign(overrides.statics);
      }
      return this;
    },
    assign: function (statics) {
      if (statics) assign(this, statics);
      return this;
    }
  });

  function dynamicClass(overrides) {
    var cls = function DynamicClass() {
      this.constructor.apply(this, arguments);
    },
        superclass = overrides.extend,
        superproto = void 0,
        proto = void 0;

    assign(cls, Base);

    if (!isFunc(superclass) || superclass === Object) superclass = Base;

    superproto = superclass.prototype;

    proto = create(superproto);

    cls.superclass = superproto;
    cls.prototype = proto;
    setPrototypeOf(cls, superclass);

    delete overrides.extend;
    return cls.extend(overrides);
  }

var _$1 = Object.freeze({
    overridePolicy: overridePolicy,
    policy: policy,
    eq: eq,
    hasOwnProp: hasOwnProp,
    isPrimitive: isPrimitive,
    isDefine: isDefine,
    isNull: isNull,
    isNil: isNil,
    isArray: isArray,
    isFunc: isFunc,
    isNumber: isNumber,
    isBool: isBool,
    isDate: isDate,
    isString: isString,
    isObject: isObject,
    isRegExp: isRegExp,
    isArrayLike: isArrayLike,
    each: each$1,
    map: map,
    filter: filter,
    aggregate: aggregate,
    keys: keys,
    values: values,
    indexOf: indexOf,
    lastIndexOf: lastIndexOf,
    convert: convert,
    reverseConvert: reverseConvert,
    upperFirst: upperFirst,
    ltrim: ltrim,
    rtrim: rtrim,
    trim: trim,
    thousandSeparate: thousandSeparate,
    plural: plural,
    singular: singular,
    parseExpr: parseExpr,
    get: get,
    has: has,
    set: set,
    getOwnProp: getOwnProp,
    prototypeOf: prototypeOf,
    setPrototypeOf: setPrototypeOf,
    assign: assign,
    assignIf: assignIf,
    emptyFunc: emptyFunc,
    create: create,
    isExtendOf: isExtendOf,
    dynamicClass: dynamicClass
  });

  var Configuration = dynamicClass({
    constructor: function (def) {
      this.cfg = def || {};
    },
    register: function (name, defVal) {
      var _this = this;

      if (arguments.length == 1) {
        each$1(name, function (val, name) {
          _this.cfg[name] = val;
        });
      } else {
        this.cfg[name] = defVal;
      }
      return this;
    },
    config: function (cfg) {
      var _this2 = this;

      if (cfg) each$1(this.cfg, function (val, key) {
        if (hasOwnProp(cfg, key)) _this2.cfg[key] = cfg[key];
      });
      return this;
    },
    get: function (name) {
      return arguments.length ? this.cfg[name] : create(this.cfg);
    }
  });

  var reg = /%(\d+\$|\*|\$)?([-+#0, ]*)?(\d+\$?|\*|\$)?(\.\d+\$?|\.\*|\.\$)?([%sfducboxXeEgGpP])/g;
var   thousandSeparationReg$1 = /(\d)(?=(\d{3})+(?!\d))/g;
  function pad(str, len, chr, leftJustify) {
    var l = str.length,
        padding = l >= len ? '' : Array(1 + len - l >>> 0).join(chr);

    return leftJustify ? str + padding : padding + str;
  }

  function format(str, args) {
    var index = 0;

    function parseWidth(width) {
      if (!width) {
        width = 0;
      } else if (width == '*') {
        width = +args[index++];
      } else if (width == '$') {
        width = +args[index];
      } else if (width.charAt(width.length - 1) == '$') {
        width = +args[width.slice(0, -1) - 1];
      } else {
        width = +width;
      }
      return isFinite(width) ? width < 0 ? 0 : width : 0;
    }

    function parseArg(i) {
      if (!i || i == '*') return args[index++];
      if (i == '$') return args[index];
      return args[i.slice(0, -1) - 1];
    }

    str = str.replace(reg, function (match, i, flags, minWidth, precision, type) {
      if (type === '%') return '%';

      var value = parseArg(i);
      minWidth = parseWidth(minWidth);
      precision = precision && parseWidth(precision.slice(1));
      if (!precision && precision !== 0) precision = 'fFeE'.indexOf(type) == -1 ? type == 'd' ? 0 : void 0 : 6;

      var leftJustify = false,
          positivePrefix = '',
          zeroPad = false,
          prefixBaseX = false,
          thousandSeparation = false,
          prefix = void 0,
          base = void 0;

      if (flags) each$1(flags, function (c) {
        switch (c) {
          case ' ':
          case '+':
            positivePrefix = c;
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
          case ',':
            thousandSeparation = true;
            break;
        }
      });
      switch (type) {
        case 'c':
          return String.fromCharCode(+value);
        case 's':
          if (isNil(value) && !isNaN(value)) return '';
          value += '';
          if (precision && value.length > precision) value = value.slice(0, precision);
          if (value.length < minWidth) value = pad(value, minWidth, zeroPad ? '0' : ' ', false);
          return value;
        case 'd':
          value = parseInt(value);
          if (isNaN(value)) return '';
          if (value < 0) {
            prefix = '-';
            value = -value;
          } else {
            prefix = positivePrefix;
          }
          value += '';

          if (value.length < minWidth) value = pad(value, minWidth, '0', false);

          if (thousandSeparation) value = value.replace(thousandSeparationReg$1, '$1,');
          return prefix + value;
        case 'e':
        case 'E':
        case 'f':
        case 'g':
        case 'G':
        case 'p':
        case 'P':
          {
            var _number = +value;
            if (isNaN(_number)) return '';
            if (_number < 0) {
              prefix = '-';
              _number = -_number;
            } else {
              prefix = positivePrefix;
            }

            var method = void 0,
                ltype = type.toLowerCase();

            if ('p' != ltype) {
              method = ['toExponential', 'toFixed', 'toPrecision']['efg'.indexOf(ltype)];
            } else {
              var sf = String(value).replace(/[eE].*|[^\d]/g, '');
              sf = (_number ? sf.replace(/^0+/, '') : sf).length;
              if (precision) precision = Math.min(precision, sf);
              method = !precision || precision <= sf ? 'toPrecision' : 'toExponential';
            }
            _number = _number[method](precision);

            if (_number.length < minWidth) _number = pad(_number, minWidth, '0', false);
            if (thousandSeparation) {
              var split = _number.split('.');
              split[0] = split[0].replace(thousandSeparationReg$1, '$1,');
              _number = split.join('.');
            }
            value = prefix + _number;
            if ('EGP'.indexOf(type) != -1) return value.toUpperCase();
            return value;
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
        case 'n':
          return '';
        default:
          return match;
      }
      var number = value >>> 0;
      prefix = prefixBaseX && base != 10 && number && ['0b', '0', '0x'][base >> 3] || '';
      number = number.toString(base);
      if (number.length < minWidth) number = pad(number, minWidth, '0', false);
      value = prefix + number;
      if (type == 'X') return value.toUpperCase();
      return value;
    });

    return {
      format: str,
      count: index
    };
  }

  function index$1(str) {
    return format(str, Array.prototype.slice.call(arguments, 1)).format;
  }
  index$1.format = format;

  var logLevels = ['debug', 'info', 'warn', 'error'];
  var tmpEl = document.createElement('div');
  var slice = Array.prototype.slice;
  var SimulationConsole = dynamicClass({
    constructor: function () {
      tmpEl.innerHTML = '<div id="simulation_console"\n    style="position:absolute; top:0; right:0; font-family:courier,monospace; background:#eee; font-size:10px; padding:10px; width:200px; height:200px;">\n  <a style="float:right; padding-left:1em; padding-bottom:.5em; text-align:right;">Clear</a>\n  <div id="simulation_console_body"></div>\n</div>';
      this.el = tmpEl.childNodes[0];
      this.clearEl = this.el.childNodes[0];
      this.bodyEl = this.el.childNodes[1];
    },
    appendTo: function (el) {
      el.appendChild(this.el);
    },
    log: function (style, msg) {
      tmpEl.innerHTML = '<span style="' + style + '">' + msg + '</span>';
      this.bodyEl.appendChild(tmpEl.childNodes[0]);
    },
    parseMsg: function (args) {
      var msg = args[0];
      if (isString(msg)) {
        var f = index$1.format.apply(null, args);
        return [f.format].concat(slice.call(args, f.count)).join(' ');
      }
      return args.join(' ');
    },
    debug: function () {
      this.log('color: red;', this.parseMsg(arguments));
    },
    info: function () {
      this.log('color: red;', this.parseMsg(arguments));
    },
    warn: function () {
      this.log('color: red;', this.parseMsg(arguments));
    },
    error: function () {
      this.log('color: red;', this.parseMsg(arguments));
    },
    clear: function () {
      this.bodyEl.innerHTML = '';
    }
  });
  var console = window.console;
  if (console && !console.debug) console.debug = function () {
    Function.apply.call(console.log, console, arguments);
  };

  var Logger = dynamicClass({
    statics: {
      enableSimulationConsole: function () {
        if (!console) {
          console = new SimulationConsole();
          console.appendTo(document.body);
        }
      }
    },
    constructor: function (_module, level) {
      this.module = _module;
      this.level = indexOf(logLevels, level || 'info');
    },
    setLevel: function (level) {
      this.level = indexOf(logLevels, level || 'info');
    },
    getLevel: function () {
      return logLevels[this.level];
    },
    _print: function (level, args, trace) {
      Function.apply.call(console[level], console, args);
      if (trace && console.trace) console.trace();
    },
    _log: function (level, args, trace) {
      if (level < this.level || !console) return;
      var msg = '[%s] %s -' + (isString(args[0]) ? ' ' + args.shift() : ''),
          errors = [];
      args = filter(args, function (arg) {
        if (arg instanceof Error) {
          errors.push(arg);
          return false;
        }
        return true;
      });
      each$1(errors, function (err) {
        args.push.call(args, err.message, '\n', err.stack);
      });
      level = logLevels[level];
      this._print(level, [msg, level, this.module].concat(args), trace);
    },
    debug: function () {
      this._log(0, slice.call(arguments, 0));
    },
    info: function () {
      this._log(1, slice.call(arguments, 0));
    },
    warn: function () {
      this._log(2, slice.call(arguments, 0));
    },
    error: function () {
      this._log(3, slice.call(arguments, 0));
    }
  });

  Logger.logger = new Logger('default', 'info');

  var IDGenerator = 1;

  var LinkedList = dynamicClass({
    statics: {
      ListKey: '__UTILITY_LIST__'
    },
    constructor: function () {
      this._id = IDGenerator++;
      this.length = 0;
      this._header = undefined;
      this._tail = undefined;
      this._version = 1;
    },
    _listObj: function (obj) {
      return hasOwnProp(obj, LinkedList.ListKey) && obj[LinkedList.ListKey];
    },
    _desc: function (obj) {
      var list = this._listObj(obj);

      return list && list[this._id];
    },
    _getOrCreateDesc: function (obj) {
      var list = this._listObj(obj) || (obj[LinkedList.ListKey] = {}),
          desc = list[this._id];

      return desc || (list[this._id] = {
        obj: obj,
        prev: undefined,
        next: undefined,
        version: this._version++
      });
    },
    _unlink: function (desc) {
      var prev = desc.prev,
          next = desc.next;

      if (prev) {
        prev.next = next;
      } else {
        this._header = next;
      }
      if (next) {
        next.prev = prev;
      } else {
        this._tail = prev;
      }
      this.length--;
    },
    _move: function (desc, prev, alwaysMove) {
      var header = this._header;

      if (header === desc || desc.prev) this._unlink(desc);

      desc.prev = prev;
      if (prev) {
        desc.next = prev.next;
        prev.next = desc;
      } else {
        desc.next = header;
        if (header) header.prev = desc;
        this._header = desc;
      }
      if (this._tail === prev) this._tail = desc;
      this.length++;
    },
    _remove: function (desc) {
      var obj = desc.obj,
          list = this._listObj(obj);

      this._unlink(desc);
      delete list[this._id];
    },
    push: function (obj) {
      return this.last(obj);
    },
    pop: function () {
      var desc = this._header;

      if (desc) {
        this._remove(desc);
        return desc.obj;
      }
      return undefined;
    },
    shift: function () {
      var desc = this._tail;

      if (desc) {
        this._remove(desc);
        return desc.obj;
      }
      return undefined;
    },
    first: function (obj) {
      if (arguments.length == 0) {
        var desc = this._header;
        return desc && desc.obj;
      }
      this._move(this._getOrCreateDesc(obj), undefined);
      return this;
    },
    last: function (obj) {
      if (arguments.length == 0) {
        var desc = this._tail;
        return desc && desc.obj;
      }
      this._move(this._getOrCreateDesc(obj), this._tail);
      return this;
    },
    before: function (obj, target) {
      if (arguments.length == 1) {
        var desc = this._desc(obj),
            prev = desc && desc.prev;

        return prev && prev.obj;
      }
      this._move(this._getOrCreateDesc(obj), this._desc(target).prev);
      return this;
    },
    after: function (obj, target) {
      if (arguments.length == 1) {
        var desc = this._desc(obj),
            next = desc && desc.next;

        return next && next.obj;
      }
      this._move(this._getOrCreateDesc(obj), this._desc(target));
      return this;
    },
    contains: function (obj) {
      return !!this._desc(obj);
    },
    remove: function (obj) {
      var list = this._listObj(obj),
          desc = void 0;

      if (list && (desc = list[this._id])) {
        this._unlink(desc);
        delete list[this._id];
        return true;
      }
      return false;
    },
    clean: function () {
      var desc = this._header;
      while (desc) {
        delete this._listObj(desc.obj)[this._id];
        desc = desc.next;
      }
      this._header = undefined;
      this._tail = undefined;
      this.length = 0;
      return this;
    },
    empty: function () {
      return this.length == 0;
    },
    size: function () {
      return this.length;
    },
    each: function (callback, scope) {
      var desc = this._header,
          ver = this._version;

      while (desc) {
        if (desc.version < ver) {
          if (callback.call(scope || this, desc.obj, this) === false) return false;
        }
        desc = desc.next;
      }
      return true;
    },
    map: function (callback, scope) {
      var _this = this;

      var rs = [];
      this.each(function (obj) {
        rs.push(callback.call(scope || _this, obj, _this));
      });
      return rs;
    },
    filter: function (callback, scope) {
      var _this2 = this;

      var rs = [];
      this.each(function (obj) {
        if (callback.call(scope || _this2, obj, _this2)) rs.push(obj);
      });
      return rs;
    },
    toArray: function () {
      var rs = [];
      this.each(function (obj) {
        rs.push(obj);
      });
      return rs;
    }
  });

  var _ = assignIf({
    format: index$1,
    timeoutframe: timeoutframe,
    Configuration: Configuration,
    Logger: Logger,
    LinkedList: LinkedList
  }, _$1);

  var configuration = new _.Configuration();

  var hasOwn$1 = Object.prototype.hasOwnProperty;
  var LISTEN_CONFIG = 'proxyListenKey';
  var LinkedList$2 = _.LinkedList;


  configuration.register(LISTEN_CONFIG, '__PROXY_LISTENERS__');

  var defaultPolicy = {
    eq: function (o1, o2) {
      return o1 === o2;
    },
    obj: function (o) {
      return o;
    },
    proxy: function (o) {
      return o;
    }
  };
  var apply = {
    change: function (obj, p) {
      var handlers = _.getOwnProp(obj, configuration.get(LISTEN_CONFIG));

      if (handlers) handlers.each(function (handler) {
        return handler(obj, p);
      });
    },
    on: function (obj, handler) {
      if (!_.isFunc(handler)) throw TypeError('Invalid Proxy Event Handler[' + handler);
      var key = configuration.get(LISTEN_CONFIG),
          handlers = _.getOwnProp(obj, key);

      if (!handlers) obj[key] = handlers = new LinkedList$2();
      handlers.push(handler);
    },
    un: function (obj, handler) {
      var handlers = _.getOwnProp(obj, configuration.get(LISTEN_CONFIG));

      if (handlers && _.isFunc(handler)) handlers.remove(handler);
      return false;
    },
    clean: function (obj) {
      if (obj[proxy$1.listenKey]) obj[proxy$1.listenKey] = undefined;
    }
  };
  function proxy$1(o) {
    return proxy$1.proxy(o);
  }

  var hasEnabled = false;
  _.assign(proxy$1, {
    isEnable: function () {
      return proxy$1.on !== _.emptyFunc;
    },
    enable: function (policy) {
      applyPolicy(policy);
      if (!hasEnabled) {
        _.overridePolicy('hasOwn', function (obj, prop) {
          return hasOwn$1.call(proxy$1.obj(obj), prop);
        });

        _.overridePolicy('eq', proxy$1.eq);
        hasEnabled = true;
      }
    },
    disable: function () {
      applyPolicy(defaultPolicy);
    }
  });

  function applyPolicy(policy) {
    var _apply = policy !== defaultPolicy ? function (fn, name) {
      proxy$1[name] = fn;
    } : function (fn, name) {
      proxy$1[name] = _.emptyFunc;
    };
    _.each(apply, _apply);
    _.each(policy, function (fn, name) {
      proxy$1[name] = fn;
    });
  }

  proxy$1.disable();

  var logger = new _.Logger('observer', 'info');

  var timeoutframe$1 = _.timeoutframe;
  var config = configuration.get();
  var LinkedList$1 = _.LinkedList;


  configuration.register({
    lazy: true,
    animationFrame: true,
    observerKey: '__OBSERVER__',
    expressionKey: '__EXPR_OBSERVER__'
  });

  var Observer = _.dynamicClass({
    constructor: function (target) {
      this.obj = target;
      this.target = target;
      this.listens = {};
      this.changeRecords = {};
      this.notify = this.notify.bind(this);
      this.watchPropNum = 0;
      this.init();
    },
    fire: function (attr, val, oldVal) {
      var _this = this;

      var handlers = this.listens[attr];

      if (handlers) {
        var primitive = _.isPrimitive(val),
            eq = proxy$1.eq(val, oldVal);
        if (!primitive || !eq) handlers.each(function (handler) {
          handler(attr, val, oldVal, _this.target, eq);
        });
      }
    },
    notify: function () {
      var _this2 = this;

      var obj = this.obj,
          changeRecords = this.changeRecords;

      this.request_frame = undefined;
      this.changeRecords = {};

      _.each(changeRecords, function (val, attr) {
        _this2.fire(attr, obj[attr], val);
      });
    },
    addChangeRecord: function (attr, oldVal) {
      if (!config.lazy) {
        this.fire(attr, this.obj[attr], oldVal);
      } else if (!(attr in this.changeRecords) && this.listens[attr]) {
        this.changeRecords[attr] = oldVal;
        if (!this.request_frame) this.request_frame = config.animationFrame ? window.requestAnimationFrame(this.notify) : timeoutframe$1.request(this.notify);
      }
    },
    hasListen: function (attr, handler) {
      switch (arguments.length) {
        case 0:
          return !!this.watchPropNum;
        case 1:
          if (_.isFunc(attr)) {
            return !_.each(this.listens, function (handlers) {
              return handlers.contains(attr);
            });
          }
          return !!this.listens[attr];
        default:
          var handlers = this.listens[attr];
          return !!handlers && handlers.contains(handler);
      }
    },
    on: function (attr, handler) {
      var handlers = void 0;

      if (!(handlers = this.listens[attr])) this.listens[attr] = handlers = new LinkedList$1();

      if (handlers.empty()) {
        this.watchPropNum++;
        this.watch(attr);
      }

      handlers.push(handler);
      return this.target;
    },
    un: function (attr, handler) {
      var handlers = this.listens[attr];

      if (handlers && !handlers.empty()) {
        if (arguments.length == 1) {
          handlers.clean();
          this.watchPropNum--;
          this.unwatch(attr);
        } else {
          handlers.remove(handler);
          if (handlers.empty()) {
            this.watchPropNum--;
            this.unwatch(attr);
          }
        }
      }
      return this.watchPropNum ? this.target : this.obj;
    },

    init: _.emptyFunc,
    watch: _.emptyFunc,
    unwatch: _.emptyFunc
  });

  function hasListen(obj, attr, handler) {
    var observer = _.getOwnProp(obj, config.observerKey);

    return observer ? arguments.length == 1 ? observer.hasListen() : arguments.length == 2 ? observer.hasListen(attr) : observer.hasListen(attr, handler) : false;
  }

  function on(obj, attr, handler) {
    var observer = _.getOwnProp(obj, config.observerKey);

    if (!observer) {
      observer = new Observer(obj);
      obj[config.observerKey] = observer;
    }
    return observer.on(attr, handler);
  }

  function un(obj, attr, handler) {
    var observer = _.getOwnProp(obj, config.observerKey);

    if (observer) return arguments.length == 2 ? observer.un(attr) : observer.un(attr, handler);
    return obj;
  }

  var expressionIdGenerator = 0;

  var Expression = _.dynamicClass({
    constructor: function (target, expr, path) {
      this.id = expressionIdGenerator++;
      this.expr = expr;
      this.handlers = new LinkedList$1();
      this.observers = [];
      this.path = path || _.parseExpr(expr);
      this.observeHandlers = this._initObserveHandlers();
      this.obj = target;
      this.target = this._observe(target, 0);
      if (proxy$1.isEnable()) {
        this._onTargetProxy = this._onTargetProxy.bind(this);
        proxy$1.on(target, this._onTargetProxy);
      }
    },
    _onTargetProxy: function (obj, proxy) {
      this.target = proxy;
    },
    _observe: function (obj, idx) {
      var prop = this.path[idx],
          o = void 0;

      if (idx + 1 < this.path.length && (o = obj[prop])) {
        o = this._observe(proxy$1.obj(o), idx + 1);
        if (proxy$1.isEnable()) obj[prop] = o;
      }
      return on(obj, prop, this.observeHandlers[idx]);
    },
    _unobserve: function (obj, idx) {
      var prop = this.path[idx],
          o = void 0,
          ret = void 0;

      ret = un(obj, prop, this.observeHandlers[idx]);
      if (idx + 1 < this.path.length && (o = obj[prop])) {
        o = this._unobserve(proxy$1.obj(o), idx + 1);
        if (proxy$1.isEnable()) obj[prop] = o;
      }
      return ret;
    },
    _initObserveHandlers: function () {
      return _.map(this.path, function (prop, i) {
        return this._createObserveHandler(i);
      }, this);
    },
    _createObserveHandler: function (idx) {
      var _this3 = this;

      var path = this.path.slice(0, idx + 1),
          rpath = this.path.slice(idx + 1),
          ridx = this.path.length - idx - 1;

      return function (prop, val, oldVal, t, eq) {
        if (ridx) {
          if (eq) return;

          if (oldVal) {
            oldVal = proxy$1.obj(oldVal);
            _this3._unobserve(oldVal, idx + 1);
            oldVal = _.get(oldVal, rpath);
          } else {
            oldVal = undefined;
          }

          if (val) {
            var mobj = proxy$1.obj(val);

            val = _.get(mobj, rpath);
            mobj = _this3._observe(mobj, idx + 1);
            if (proxy$1.isEnable()) {
              // update proxy val
              var i = 0,
                  obj = _this3.obj;

              while (i < idx) {
                obj = proxy$1.obj(obj[path[i++]]);
                if (!obj) return;
              }
              obj[path[i]] = mobj;
            }
          } else {
            val = undefined;
          }

          var primitive = _.isPrimitive(val);
          eq = proxy$1.eq(val, oldVal);

          if (primitive && eq) return;
        }
        _this3.handlers.each(function (handler) {
          return handler(_this3.expr, val, oldVal, _this3.target, eq);
        });
      };
    },
    on: function (handler) {
      this.handlers.push(handler);
      return this;
    },
    un: function (handler) {
      if (!arguments.length) {
        this.handlers.clean();
      } else {
        this.handlers.remove(handler);
      }
      return this;
    },
    hasListen: function (handler) {
      return arguments.length ? this.handlers.contains(handler) : !this.handlers.empty();
    }
  });

var   policies$1 = [];
  var inited = false;

  var core = {
    on: function (obj, expr, handler) {
      var path = _.parseExpr(expr);

      obj = proxy$1.obj(obj);
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
      return on(obj, expr, handler);
    },
    un: function (obj, expr, handler) {
      var path = _.parseExpr(expr);

      obj = proxy$1.obj(obj);
      if (path.length > 1) {
        var map = _.getOwnProp(obj, config.expressionKey),
            exp = map ? map[expr] : undefined;

        if (exp) {
          arguments.length == 2 ? exp.un() : exp.un(handler);
          return exp.hasListen() ? exp.target : exp.obj;
        }
        return obj;
      }
      return arguments.length == 2 ? un(obj, expr) : un(obj, expr, handler);
    },
    hasListen: function (obj, expr, handler) {
      var l = arguments.length;

      obj = proxy$1.obj(obj);
      switch (l) {
        case 1:
          return hasListen(obj);
        case 2:
          if (_.isFunc(expr)) return hasListen(obj, expr);
      }

      var path = _.parseExpr(expr);

      if (path.length > 1) {
        var map = _.getOwnProp(obj, config.expressionKey),
            exp = map ? map[expr] : undefined;

        return exp ? l == 2 ? true : exp.hasListen(handler) : false;
      }
      return hasListen.apply(null, arguments);
    },
    registerPolicy: function (name, priority, checker, policy) {
      policies$1.push({
        name: name,
        priority: priority,
        policy: policy,
        checker: checker
      });
      policies$1.sort(function (p1, p2) {
        return p1.priority - p2.priority;
      });
      logger.info('register observe policy[%s], priority is %d', name, priority);
      return this;
    },
    init: function (cfg) {
      if (!inited) {
        configuration.config(cfg);
        if (_.each(policies$1, function (policy) {
          if (policy.checker(config)) {
            _.each(policy.policy(config), function (val, key) {
              Observer.prototype[key] = val;
            });
            config.policy = policy.name;
            logger.info('apply observe policy[%s], priority is %d', policy.name, policy.priority);
            return false;
          }
        }) !== false) throw Error('observer is not supported');
        inited = true;
      }
      return this;
    }
  };

  configuration.register({
    es6Proxy: true,
    es6SourceKey: '__ES6_PROXY_SOURCE__',
    es6ProxyKey: '__ES6_PROXY__'
  });

  var hasOwn$2 = Object.prototype.hasOwnProperty;

  core.registerPolicy('ES6Proxy', 1, function (config) {
    return window.Proxy && config.es6Proxy !== false;
  }, function (config) {
    var es6SourceKey = config.es6SourceKey;
    var es6ProxyKey = config.es6ProxyKey;


    proxy$1.enable({
      obj: function (obj) {
        if (obj && hasOwn$2.call(obj, es6SourceKey)) return obj[es6SourceKey];
        return obj;
      },
      eq: function (o1, o2) {
        return o1 === o2 || proxy$1.obj(o1) === proxy$1.obj(o2);
      },
      proxy: function (obj) {
        if (obj && hasOwn$2.call(obj, es6ProxyKey)) return obj[es6ProxyKey] || obj;
        return obj;
      }
    });

    return {
      init: function () {
        this.es6proxy = false;
      },
      watch: function (attr) {
        if (!this.es6proxy) {
          var _proxy = this.objectProxy(),
              obj = this.obj;

          this.target = _proxy;
          obj[es6ProxyKey] = _proxy;
          obj[es6SourceKey] = obj;
          proxy$1.change(obj, _proxy);
          this.es6proxy = true;
        }
      },
      unwatch: function (attr) {},
      objectProxy: function () {
        var _this = this;

        return new Proxy(this.obj, {
          set: function (obj, prop, value) {
            if (_this.listens[prop]) {
              var oldVal = obj[prop];
              obj[prop] = value;
              _this.addChangeRecord(prop, oldVal);
            } else {
              obj[prop] = value;
            }
            return true;
          }
        });
      }
    };
  });

var   hasOwn$3 = Object.prototype.hasOwnProperty;
  var RESERVE_PROPS = 'hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'.split(',');
  var RESERVE_ARRAY_PROPS = 'concat,copyWithin,entries,every,fill,filter,find,findIndex,forEach,includes,indexOf,join,keys,lastIndexOf,map,pop,push,reduce,reduceRight,reverse,shift,slice,some,sort,splice,unshift,values'.split(',');
  var VBClassFactory = _.dynamicClass({
    constBind: '__VB_CONST__',
    descBind: '__VB_PROXY__',
    classNameGenerator: 0,
    constructor: function (defProps, onProxyChange) {
      this.classPool = {};
      this.defPropMap = {};
      this.onProxyChange = onProxyChange;
      this.addDefProps(defProps);
      this.initConstScript();
    },
    setConstBind: function (constBind) {
      this.constBind = constBind;
      this.initConstScript();
    },
    setDescBind: function (descBind) {
      this.descBind = descBind;
      this.initConstScript();
    },
    addDefProps: function (defProps) {
      var defPropMap = this.defPropMap,
          props = [];

      _.each(defProps || [], function (prop) {
        defPropMap[prop] = true;
      });
      for (var prop in defPropMap) {
        if (hasOwn$3.call(defPropMap, prop)) props.push(prop);
      }
      this.defProps = props;
      logger.info('VBProxy default props is: ', props.join(','));
      this.initReserveProps();
    },
    initReserveProps: function () {
      this.reserveProps = RESERVE_PROPS.concat(this.defProps);
      this.reserveArrayProps = this.reserveProps.concat(RESERVE_ARRAY_PROPS);
      this.reservePropMap = _.reverseConvert(this.reserveProps);
      this.reserveArrayPropMap = _.reverseConvert(this.reserveArrayProps);
    },
    initConstScript: function () {
      this.constScript = ['\tPublic [', this.descBind, ']\r\n', '\tPublic Default Function [', this.constBind, '](desc)\r\n', '\t\tset [', this.descBind, '] = desc\r\n', '\t\tSet [', this.constBind, '] = Me\r\n', '\tEnd Function\r\n'].join('');
    },
    generateClassName: function () {
      return 'VBClass' + this.classNameGenerator++;
    },
    parseClassConstructorName: function (className) {
      return className + 'Constructor';
    },
    generateSetter: function (attr) {
      var descBind = this.descBind;

      return ['\tPublic Property Get [', attr, ']\r\n', '\tOn Error Resume Next\r\n', '\t\tSet[', attr, '] = [', descBind, '].get("', attr, '")\r\n', '\tIf Err.Number <> 0 Then\r\n', '\t\t[', attr, '] = [', descBind, '].get("', attr, '")\r\n', '\tEnd If\r\n', '\tOn Error Goto 0\r\n', '\tEnd Property\r\n'];
    },
    generateGetter: function (attr) {
      var descBind = this.descBind;

      return ['\tPublic Property Let [', attr, '](val)\r\n', '\t\tCall [', descBind, '].set("', attr, '",val)\r\n', '\tEnd Property\r\n', '\tPublic Property Set [', attr, '](val)\r\n', '\t\tCall [', descBind, '].set("', attr, '",val)\r\n', '\tEnd Property\r\n'];
    },
    generateClass: function (className, props, funcMap) {
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
    generateClassConstructor: function (props, funcMap, funcArray) {
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
    create: function (obj, desc) {
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
      desc.proxy = proxy;

      _.each(funcs, function (prop) {
        proxy[prop] = _this2.funcProxy(obj[prop], prop in protoPropMap ? obj : proxy);
      });

      this.onProxyChange(obj, proxy);
      return desc;
    },
    funcProxy: function (fn, scope) {
      return function () {
        return fn.apply(this === window ? scope : this, arguments);
      };
    },
    eq: function (o1, o2) {
      var d1 = this.descriptor(o1),
          d2 = this.descriptor(o2);

      if (d1) o1 = d1.obj;
      if (d2) o2 = d2.obj;
      return o1 === o2;
    },
    obj: function (obj) {
      var desc = this.descriptor(obj);

      return desc ? desc.obj : obj;
    },
    proxy: function (obj) {
      var desc = this.descriptor(obj);

      return desc ? desc.proxy : undefined;
    },
    isProxy: function (obj) {
      return hasOwn$3.call(obj, this.constBind);
    },
    descriptor: function (obj) {
      var descBind = this.descBind;

      return hasOwn$3.call(obj, descBind) ? obj[descBind] : undefined;
    },
    destroy: function (desc) {
      this.onProxyChange(obj, undefined);
    }
  });

  var ObjectDescriptor = _.dynamicClass({
    constructor: function (obj, props, classGenerator) {
      this.classGenerator = classGenerator;
      this.obj = obj;
      this.defines = _.reverseConvert(props, function () {
        return false;
      });
      obj[classGenerator.descBind] = this;
      this.accessorNR = 0;
    },
    isAccessor: function (desc) {
      return desc && (desc.get || desc.set);
    },
    hasAccessor: function () {
      return !!this.accessorNR;
    },
    defineProperty: function (attr, desc) {
      var defines = this.defines,
          obj = this.obj;

      if (!(attr in defines)) {
        if (!(attr in obj)) {
          obj[attr] = undefined;
        } else if (_.isFunc(obj[attr])) {
          logger.warn('defineProperty not support function [' + attr + ']');
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
    getPropertyDefine: function (attr) {
      return this.defines[attr] || undefined;
    },
    get: function (attr) {
      var define = this.defines[attr];

      return define && define.get ? define.get.call(this.proxy) : this.obj[attr];
    },
    set: function (attr, value) {
      var define = this.defines[attr];

      if (define && define.set) {
        define.set.call(this.proxy, value);
      } else {
        this.obj[attr] = value;
      }
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
        logger.error(e.message, e);
      }
    }
    return supported;
  };

  var arrayHooks = 'fill,pop,push,reverse,shift,sort,splice,unshift'.split(',');

  configuration.register({
    defaultProps: []
  });

  var policy$1 = {
    init: function () {
      this.isArray = _.isArray(this.obj);
      this.watchers = {};
      if (this.isArray) {
        this.hookArrayMethod = this.hookArrayMethod.bind(this);
        this.hookArray();
      }
    },
    watch: function (attr) {
      var watchers = this.watchers;
      if (!watchers[attr] && (!this.isArray || attr != 'length')) {
        this.defineProperty(attr, this.obj[attr]);
        watchers[attr] = true;
      }
    },
    unwatch: function (attr) {
      var watchers = this.watchers;
      if (watchers[attr] && (!this.isArray || attr != 'length')) {
        this.undefineProperty(attr, this.obj[attr]);
        watchers[attr] = false;
      }
    },
    hookArray: function () {
      _.each(arrayHooks, this.hookArrayMethod);
    },
    hookArrayMethod: function (method) {
      var obj = this.obj,
          fn = Array.prototype[method],
          len = obj.length,
          self = this;

      obj[method] = function () {
        var ret = fn.apply(obj, arguments);
        self.addChangeRecord('length', len);
        len = obj.length;
        return ret;
      };
    }
  };

  core.registerPolicy('ES5DefineProperty', 10, function (config) {
    if (Object.defineProperty) {
      try {
        var _ret = function () {
          var val = void 0,
              obj = {};
          Object.defineProperty(obj, 'sentinel', {
            get: function () {
              return val;
            },
            set: function (value) {
              val = value;
            }
          });
          obj.sentinel = 1;
          return {
            v: obj.sentinel === val
          };
        }();

        if (typeof _ret === "object") return _ret.v;
      } catch (e) {}
    }
    return false;
  }, function (config) {
    return _.assignIf({
      defineProperty: function (attr, value) {
        var _this = this;

        Object.defineProperty(this.target, attr, {
          enumerable: true,
          configurable: true,
          get: function () {
            return value;
          },
          set: function (val) {
            var oldVal = value;
            value = val;
            _this.addChangeRecord(attr, oldVal);
          }
        });
      },
      undefineProperty: function (attr, value) {
        Object.defineProperty(this.target, attr, {
          enumerable: true,
          configurable: true,
          writable: true,
          value: value
        });
      }
    }, policy$1);
  });

  core.registerPolicy('DefineGetterAndSetter', 20, function (config) {
    return '__defineGetter__' in {};
  }, function (config) {
    return _.assignIf({
      defineProperty: function (attr, value) {
        var _this2 = this;

        this.target.__defineGetter__(attr, function () {
          return value;
        });
        this.target.__defineSetter__(attr, function (val) {
          var oldVal = value;

          value = val;
          _this2.addChangeRecord(attr, oldVal);
        });
      },
      undefineProperty: function (attr, value) {
        this.target.__defineGetter__(attr, function () {
          return value;
        });
        this.target.__defineSetter__(attr, function (val) {
          value = val;
        });
      }
    }, policy$1);
  });

  core.registerPolicy('VBScriptProxy', 30, function (config) {
    return VBClassFactory.isSupport();
  }, function (config) {

    var factory = void 0;

    proxy$1.enable({
      obj: function (obj) {
        return obj && factory.obj(obj);
      },
      eq: function (o1, o2) {
        return o1 === o2 || proxy$1.obj(o1) === proxy$1.obj(o2);
      },
      proxy: function (obj) {
        return obj && (factory.proxy(obj) || obj);
      }
    });
    factory = core.vbfactory = new VBClassFactory([config.proxyListenKey, config.observerKey, config.expressionKey, _.LinkedList.ListKey].concat(config.defaultProps || []), proxy$1.change);

    return _.assignIf({
      defineProperty: function (attr, value) {
        var _this3 = this;

        var obj = this.obj;

        this.target = (factory.descriptor(obj) || factory.create(obj)).defineProperty(attr, {
          set: function (val) {
            var oldVal = obj[attr];
            obj[attr] = val;
            _this3.addChangeRecord(attr, oldVal);
          }
        });
      },
      undefineProperty: function (attr, value) {
        var obj = this.obj,
            desc = factory.descriptor(obj);

        if (desc) desc.defineProperty(attr, {
          value: value
        });
      }
    }, policy$1);
  });

  function hookArrayFunc(func, obj, callback, scope, own) {
    var _this = this;

    return func(obj, function (v, k, s, o) {
      return callback.call(_this, proxy$1.proxy(v), k, s, o);
    }, scope, own);
  }

  var observer = _.assign({
    eq: function (o1, o2) {
      return proxy$1.eq(o1, o2);
    },
    obj: function (o) {
      return proxy$1.obj(o);
    },
    onproxy: function (o, h) {
      return proxy$1.on(o, h);
    },
    unproxy: function (o, h) {
      return proxy$1.un(o, h);
    },

    proxy: proxy$1,
    config: configuration.get(),

    $each: function (obj, callback, scope, own) {
      return hookArrayFunc(_.each, obj, callback, scope, own);
    },
    $map: function (obj, callback, scope, own) {
      return hookArrayFunc(_.map, obj, callback, scope, own);
    },
    $filter: function (obj, callback, scope, own) {
      return hookArrayFunc(_.filter, obj, callback, scope, own);
    },
    $aggregate: function (obj, callback, defVal, scope, own) {
      var rs = defVal;
      each(obj, function (v, k, s, o) {
        rs = callback.call(this, rs, proxy$1.proxy(v), k, s, o);
      }, scope, own);
      return rs;
    },
    $keys: function (obj, filter, scope, own) {
      var keys = [];
      each(obj, function (v, k, s, o) {
        if (!filter || filter.call(this, proxy$1.proxy(v), k, s, o)) keys.push(k);
      }, scope, own);
      return keys;
    },
    $values: function (obj, filter, scope, own) {
      var values = [];
      each(obj, function (v, k, s, o) {
        if (!filter || filter.call(this, proxy$1.proxy(v), k, s, o)) values.push(v);
      }, scope, own);
      return values;
    }
  }, core);

  var index = _.assignIf(_.create(observer), {
    observer: observer,
    utility: _
  }, _);

  return index;

}));
//# sourceMappingURL=observer.all.js.map