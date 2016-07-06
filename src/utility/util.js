const toStr = Object.prototype.toString,
  hasOwn = Object.prototype.hasOwnProperty

export function hasOwnProp(obj, prop) {
  return hasOwn.call(obj, prop)
}

// ==============================================
// type utils
// ==============================================
export const argsType = '[object Arguments]'
export const arrayType = '[object Array]'
export const funcType = '[object Function]'
export const boolType = '[object Boolean]'
export const numberType = '[object Number]'
export const dateType = '[object Date]'
export const stringType = '[object String]'
export const objectType = '[object Object]'
export const regexpType = '[object RegExp]'
export const nodeListType = '[object NodeList]'

export function isDefine(obj) {
  return obj === undefined
}

export function isNull(obj) {
  return obj === null
}

export function isNil(obj) {
  return obj === undefined || obj === null
}

export function isArray(obj) {
  return toStr.call(obj) === arrayType
}

export function isFunc(obj) {
  return toStr.call(obj) === funcType
}

export function isNumber(obj) {
  return toStr.call(obj) === numberType
}

export function isNaN(obj) {
  return obj === NaN
}

export function isBool(obj) {
  return toStr.call(obj) === boolType
}

export function isDate(obj) {
  return toStr.call(obj) === dateType
}

export function isString(obj) {
  return toStr.call(obj) === stringType
}

export function isObject(obj) {
  return toStr.call(obj) === objectType
}

export function isRegExp(obj) {
  return toStr.call(obj) === regexpType
}

export function isArrayLike(obj) {
  let type = toStr.call(obj)
  switch (type) {
    case argsType:
    case arrayType:
    case stringType:
    case nodeListType:
      return true
    default:
      if(obj){
        let length = obj.length
        return isNumber(length) && length > 0 && ( length - 1 ) in obj
      }
      return false
  }
}

// ==============================================
// array utils
// ==============================================
function _eachObj(obj, callback, scope, own) {
  let key, isOwn

  scope = scope || obj
  for (key in obj) {
    isOwn = hasOwnProp(obj, key)
    if (own === false || isOwn) {
      if (callback.call(scope, obj[key], key, obj, isOwn) === false)
        return false
    }
  }
  return true
}

function _eachArray(obj, callback, scope) {
  let i = 0,
    j = obj.length

  scope = scope || obj
  for (; i < j; i++) {
    if (callback.call(scope, obj[i], i, obj, true) === false)
      return false
  }
  return true
}

export function each(obj, callback, scope, own) {
  if (isArrayLike(obj)) {
    return _eachArray(obj, callback, scope)
  } else if (!isNil(obj)) {
    return _eachObj(obj, callback, scope, own)
  }
  return true
}

export function map(obj, callback, scope, own) {
  let ret

  function cb(val, key) {
    ret[key] = callback.apply(this, arguments)
  }

  if (isArrayLike(obj)) {
    ret = []
    _eachArray(obj, cb, scope)
  } else {
    ret = {}
    if (!isNil(obj))
      _eachObj(obj, cb, scope, own)
  }
  return ret
}

export function filter(obj, callback, scope, own) {
  let ret

  if (isArrayLike(obj)) {
    ret = []
    _eachArray(obj, function(val) {
      if (callback.apply(this, arguments))
        ret.push(val)
    }, scope)
  } else {
    ret = {}
    if (!isNil(obj))
      _eachObj(obj, function(val, key) {
        if (callback.apply(this, arguments))
          ret[key] = val
      }, scope, own)
  }
  return ret
}

export function aggregate(obj, callback, defVal, scope, own) {
  let rs = defVal

  each(obj, function(val, key, obj, isOwn) {
    rs = callback.call(this, rs, val, key, obj, isOwn)
  }, scope, own)
  return rs
}

export function keys(obj, filter, scope, own) {
  let keys = []

  each(obj, function(val, key) {
    if (!filter || filter.apply(this, arguments))
      keys.push(key)
  }, scope, own)
  return keys
}

function _indexOfArray(array, val) {
  let i = 0,
    l = array.length

  for (; i < l; i++) {
    if (array[i] === val)
      return i
  }
  return -1
}

function _lastIndexOfArray(array, val) {
  let i = array.length

  while (i-- > 0) {
    if (array[i] === val)
      return i
  }
}

function _indexOfObj(obj, val, own) {
  for (key in obj) {
    if (own === false || hasOwnProp(obj, key)) {
      if (obj[key] === val)
        return key
    }
  }
  return undefined
}

export function indexOf(obj, val, own) {
  if (isArrayLike(obj)) {
    return _indexOfArray(obj, val)
  } else {
    return _indexOfObj(obj, val, own)
  }
}

export function lastIndexOf(obj, val, own) {
  if (isArrayLike(obj)) {
    return _lastIndexOfArray(obj, val)
  } else {
    return _indexOfObj(obj, val, own)
  }
}

export function convert(obj, keyGen, valGen, scope, own) {
  let o = {}

  each(obj, function(val, key) {
    o[keyGen ? keyGen.apply(this, arguments) : key] = valGen ? valGen.apply(this, arguments) : val
  }, scope, own)
  return o
}

export function reverseConvert(obj, valGen, scope, own) {
  let o = {}

  each(obj, function(val, key) {
    o[val] = valGen ? valGen.apply(this, arguments) : key
  }, scope, own)
  return o
}

// ==============================================
// string utils
// ==============================================
const regFirstChar = /^[a-z]/,
  regLeftTrim = /^\s+/,
  regRightTrim = /\s+$/,
  regTrim = /(^\s+)|(\s+$)/g

function _uppercase(k) {
  return k.toUpperCase()
}

export function upperFirst(str) {
  return str.replace(regFirstChar, _uppercase)
}

export function ltrim(str) {
  return str.replace(regLeftTrim, '')
}

export function rtrim(str) {
  return str.replace(regRightTrim, '')
}

export function trim(str) {
  return str.replace(regTrim, '')
}

const regFormat = /%%|%(\d+\$)?([-+#0 ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([scboxXuidfegpEGP])/g

function pad(str, len, chr, leftJustify) {
  let padding = (str.length >= len) ? '' : Array(1 + len - str.length >>> 0).join(chr)

  return leftJustify ? str + padding : padding + str
}

function justify(value, prefix, leftJustify, minWidth, zeroPad) {
  var diff = minWidth - value.length

  if (diff > 0)
    return leftJustify || !zeroPad ?
      pad(value, minWidth, ' ', leftJustify) :
      value.slice(0, prefix.length) + pad('', diff, '0', true) + value.slice(prefix.length)
  return value
}

export function format(str){
  return _format(str, Array.prototype.slice.call(arguments, 1)).format
}

export function _format(str, args) {
  let i = 0
  str = str.replace(regFormat, function(substring, valueIndex, flags, minWidth, _, precision, type) {
    if (substring == '%%') return '%'

    let leftJustify = false,
      positivePrefix = '',
      zeroPad = false,
      prefixBaseX = false

    if (flags)
      each(flags, function(c) {
        switch (c) {
          case ' ':
            positivePrefix = ' '
            break
          case '+':
            positivePrefix = '+'
            break
          case '-':
            leftJustify = true
            break
          case '0':
            zeroPad = true
            break
          case '#':
            prefixBaseX = true
            break
        }
      })

    if (!minWidth) {
      minWidth = 0
    } else if (minWidth == '*') {
      minWidth = +args[i++]
    } else if (minWidth.charAt(0) == '*') {
      minWidth = +args[minWidth.slice(1, -1)]
    } else {
      minWidth = +minWidth
    }

    if (minWidth < 0) {
      minWidth = -minWidth
      leftJustify = true
    }

    if (!isFinite(minWidth))
      throw new Error('sprintf: (minimum-)width must be finite')

    if (precision && precision.charAt(0) == '*') {
      precision = +args[(precision == '*') ? i++ : precision.slice(1, -1)]
      if (precision < 0)
        precision = null
    }

    if (precision == null) {
      precision = 'fFeE'.indexOf(type) > -1 ? 6 : (type == 'd') ? 0 : void(0)
    } else {
      precision = +precision
    }

    let value = valueIndex ? args[valueIndex.slice(0, -1)] : args[i++],
      prefix, base

    switch (type) {
      case 'c':
        value = String.fromCharCode(+value)
      case 's':
        {
          value = String(value)
          if (precision != null)
            value = value.slice(0, precision)
          prefix = ''
          break
        }
      case 'b':
        base = 2
        break
      case 'o':
        base = 8
        break
      case 'u':
        base = 10
        break
      case 'x':
      case 'X':
        base = 16
        break
      case 'i':
      case 'd':
        {
          let number = parseInt(+value)
          if (isNaN(number))
            return ''
          prefix = number < 0 ? '-' : positivePrefix
          value = prefix + pad(String(Math.abs(number)), precision, '0', false)
          break
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
          let number = +value
          if (isNaN(number))
            return ''
          prefix = number < 0 ? '-' : positivePrefix
          let method
          if ('p' != type.toLowerCase()) {
            method = ['toExponential', 'toFixed', 'toPrecision']['efg'.indexOf(type.toLowerCase())]
          } else {
            // Count significant-figures, taking special-care of zeroes ('0' vs '0.00' etc.)
            let sf = String(value).replace(/[eE].*|[^\d]/g, '')
            sf = (number ? sf.replace(/^0+/, '') : sf).length
            precision = precision ? Math.min(precision, sf) : precision
            method = (!precision || precision <= sf) ? 'toPrecision' : 'toExponential'
          }
          let number_str = Math.abs(number)[method](precision)
          // number_str = thousandSeparation ? thousand_separate(number_str): number_str
          value = prefix + number_str
          break
        }
      case 'n':
        return ''
      default:
        return substring
    }

    if (base) {
      var number = value >>> 0
      prefix = prefixBaseX && base != 10 && number && ['0b', '0', '0x'][base >> 3] || ''
      value = prefix + pad(number.toString(base), precision || 0, '0', false)
    }
    var justified = justify(value, prefix, leftJustify, minWidth, zeroPad)
    return ('EFGPX'.indexOf(type) > -1) ? justified.toUpperCase() : justified
  })
  return {
    format: str,
    formatArgCount: i
  }
}

// ==============================================
// object utils
// ==============================================
const exprCache = {},
  regPropertyName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g,
  regEscapeChar = /\\(\\)?/g

export function parseExpr(expr, autoCache) {
  if (isArray(expr)) {
    return expr
  } else if (isString(expr)) {
    let rs = exprCache[expr]

    if (rs)
      return rs
    rs = autoCache ? (exprCache[expr] = []) : []
    expr.replace(regPropertyName, function(match, number, quote, string) {
      rs.push(quote ? string.replace(regEscapeChar, '$1') : (number || match))
    })
    return rs
  } else {
    return []
  }
}

export function get(obj, expr, defVal, lastOwn, own) {
  let i = 0,
    path = parseExpr(expr, true),
    l = path.length - 1,
    prop

  while (!isNil(obj) && i < l) {
    prop = path[i++]
    if (own && !hasOwnProp(obj, prop))
      return defVal
    obj = obj[prop]
  }
  prop = path[i]
  return (i == l && !isNil(obj) && (own ? hasOwnProp(obj, prop) : prop in obj)) ? obj[prop] : defVal
}

export function has(obj, expr, lastOwn, own) {
  let i = 0,
    path = parseExpr(expr, true),
    l = path.length - 1,
    prop

  while (!isNil(obj) && i < l) {
    prop = path[i++]
    if (own && !hasOwnProp(obj, prop))
      return false
    obj = obj[prop]
  }
  prop = path[i]
  return i == l && !isNil(obj) && (own ? hasOwnProp(obj, prop) : prop in obj)
}

export function set(obj, expr, value) {
  let i = 0,
    path = parseExpr(expr, true),
    l = path.length - 1,
    prop = path[0],
    _obj = obj

  for (; i < l; i++) {
    if (isNil(_obj[prop]))
      _obj = _obj[prop] = {}
    prop = path[i + 1]
  }
  obj[prop] = value
  return obj
}

export function getOwnProp(obj, key){
  return hasOwnProp(obj, key) ? obj[key] : undefined
}

export let prototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function getPrototypeOf(obj) {
  return obj.__proto__
}

export let setPrototypeOf = Object.setPrototypeOf || function setPrototypeOf(obj, proto) {
  obj.__proto__ = proto
}

export let assign = Object.assign || function assign(target) {
  let source, key,
    i = 1,
    l = arguments.length

  for (; i < l; i++) {
    source = arguments[i]
    for (key in source) {
      if (hasOwnProp(source, key))
        target[key] = source[key]
    }
  }
  return target
}

export function assignIf(target) {
  let source, key,
    i = 1,
    l = arguments.length

  for (; i < l; i++) {
    source = arguments[i]
    for (key in source) {
      if (hasOwnProp(source, key) && !hasOwnProp(target, key))
        target[key] = source[key]
    }
  }
  return target
}

export function emptyFunc() {}

export let create = Object.create || function(parent, props) {
  emptyFunc.prototype = parent
  let obj = new emptyFunc()
  emptyFunc.prototype = undefined
  if (props) {
    for (let prop in props) {
      if (hasOwnProp(props, prop))
        obj[prop] = props[prop]
    }
  }
  return obj
}

export function isExtendOf(cls, parent) {
  if (!isFunc(cls))
    return (cls instanceof parent)

  let proto = cls

  while ((proto = prototypeOf(proto))) {
    if (proto === parent)
      return true
  }
  return false
}

const classOptionConstructorKey = 'constructor',
  classOptionExtendKey = 'extend'

export function dynamicClass(cfg, options) {
  let constructorKey, extendKey, constructor, superCls, cls

  if (!isObject(cfg))
    throw TypeError(`Invalid Class Config: ${cfg}`)

  options = options || {}
  constructorKey = isString(options.constructor) ? options.constructor : classOptionConstructorKey
  extendKey = isString(options.extend) ? options.extend : classOptionExtendKey
  constructor = cfg[constructorKey]
  superCls = cfg[extendKey]

  if (!isFunc(constructor) || constructor === Object)
    constructor = undefined
  if (!isFunc(superCls) || superCls === Object)
    superCls = undefined

  cls = (function(constructor, superCls) {
    function DynamicClass() {
      if (superCls && !(this instanceof superCls))
        throw new TypeError('Cannot call a class as a function')
      if (constructor) {
        constructor.apply(this, arguments)
      } else if (superCls) {
        superCls.apply(this, arguments)
      }
    }
    let proto = {
      constructor: {
        value: DynamicClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    }

    DynamicClass.prototype = superCls ? create(superCls.prototype, proto) : proto
    setPrototypeOf(DynamicClass, superCls || {})
    return DynamicClass
  })(constructor, superCls)

  each(cfg, (val, key) => {
    if (key !== constructorKey)
      cls.prototype[key] = val
  })
  return cls
}
