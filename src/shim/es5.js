const _ = window._;

if (!Function.prototype.bind) {
  Function.prototype.bind = function bind(scope) {
    if (arguments.length < 2 && (scope === undefined || scope === null)) {
      return this;
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
  }
}

function fixFn(Type, name, lodash, fn) {
  if (typeof Type[name] != 'function') {
    if (typeof lodash == 'function') {
      fn = lodash;
      lodash = name;
    }
    if (lodash && _) {
      Type[name] = _[lodash].bind(_);
    } else {
      Type[name] = fn;
    }
  }
}

function fixProtoFn(Type, name, lodash, fn) {
  Type = Type.prototype;
  if (typeof Type[name] != 'function') {
    if (typeof lodash == 'function') {
      fn = lodash;
      lodash = name;
    }
    if (lodash && _) {
      Type[name] = function() {
        let arg = [this];
        arg.push.apply(arg, arguments);
        return _[lodash].apply(_, arguments);
      };
    } else {
      Type[name] = fn;
    }
  }
}

fixFn(Object, 'create');

fixFn(Object, 'keys', function keys() {
  let ret = [];
  for (let key in this) {
    if (Object.prototype.hasOwnProperty.call(this, key))
      ret.push(key);
  }
  return ret;
});

fixFn(Object, 'getPrototypeOf', false, function getPrototypeOf(object) {
  var proto = object.__proto__;
  if (proto || proto === null) {
    return proto;
  } else if (typeof object.constructor == 'function') {
    return object.constructor.prototype;
  }
  return null;
});

fixFn(Object, 'setPrototypeOf', false, function setPrototypeOf(object, proto) {
  object.__proto__ = proto;
});


fixFn(Array, 'isArray', function isArray(arr) {
  return arr instanceof Array;
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
    ret[i] = callback(this[i], i);
  }
  return ret;
});

fixProtoFn(Array, 'filter', function filter(callback) {
  let ret = [];
  for (let i = 0; i < this.length; i++) {
    if (callback(this[i], i))
      ret.push(this[i]);
  }
  return ret;
});

fixProtoFn(Array, 'every', function every(callback) {
  for (let i = 0; i < this.length; i++) {
    if (!callback(this[i], i))
      return false;
  }
  return true;
});

fixProtoFn(Array, 'some', function every(callback) {
  for (let i = 0; i < this.length; i++) {
    if (callback(this[i], i))
      return true;
  }
  return false;
});

fixProtoFn(Array, 'fill', function every(value, start, end) {
  start = typeof start === 'undefined' ? 0 : parseInt(start);
  end = typeof end === 'undefined' ? 0 : parseInt(end);

  for (let i = start; i < end; i++) {
    this[i] = value;
  }
  return this;
});

fixProtoFn(Array, 'indexOf', function indexOf(val) {
  for (let i = 0; i < this.length; i++) {
    if (this[i] === val) {
      return i;
    }
  }
  return -1;
});

fixProtoFn(Array, 'lastIndexOf', function lastIndexOf(val) {
  if (this.length) {
    for (let i = this.length - 1; i >= 0; i--) {
      if (this[i] === val) {
        return i;
      }
    }
  }
  return -1;
});
