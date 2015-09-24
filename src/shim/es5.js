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
      Type[name] = function() {
        if (window._) {
          return window._[lodash].apply(window._, arguments);
        } else {
          fn.apply(this, arguments);
        }
      }
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
      Type[name] = function() {
        if (window._) {
          let arg = [this];
          arg.push.apply(arg, arguments);
          return window._[lodash].apply(window._, arguments);
        } else {
          fn.apply(this, arguments);
        }
      }
    }
  }
}

fixFn(Object, 'create');

fixFn(Object, 'keys', function keys() {
  let ret = [];
  for (let key in this) {
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
  }
  Object.setPrototypeOf = function setPrototypeOf(object, proto) {
    object.__proto__ = proto;
  }
}

fixFn(Array, 'isArray', function isArray(arr) {
  return arr && arr instanceof Array;
});

fixProtoFn(Function, 'bind', function bind(scope) {
  if (arguments.length < 2 && scope === undefined) {
    return this
  }
  let fn = this,
    bindArgs = [];
  bindArgs.push.apply(bindArgs, arguments);
  return function() {
    let args = [];
    args.push.apply(args, bindArgs);
    args.push.apply(args, arguments);
    fn.apply(scope, args);

  }
});

fixProtoFn(Array, 'forEach', function forEach(callback) {
  for (let i = 0; i < this.length; i++) {
    callback(this[i], i);
  }
  return this;
});

fixProtoFn(Array, 'map', function map(callback) {
  let ret = [];
  for (let i = 0; i < this.length; i++) {
    ret.push(callback(this[i], i));
  }
  return ret;
});

fixProtoFn(Array, 'filter', function filter(callback) {
  let ret = [];
  for (let i = 0; i < this.length; i++) {
    if (callback(this[i], i)) {
      ret.push(this[i]);
    }
  }
  return ret;
});

fixProtoFn(Array, 'indexOf', function indexOf(val) {
  for (let i = 0; i < this.length; i++) {
    if (this[i] === val) {
      return i;
    }
  }
  return -1;
});
