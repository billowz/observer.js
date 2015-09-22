let Util = {
  isObject(obj) {
    return typeof obj == 'object';
  },
  isArray(obj) {
    return obj && obj instanceof Array;
  },
  isFunction(fn) {
    return typeof fn == 'function';
  },
  isString(str) {
    return typeof str == 'string';
  },
  each(obj, callback) {
    if (Util.isArray(obj)) {
      obj.forEach(callback);
    } else if (Util.isObject(obj)) {
      for (let key in obj) {
        callback(obj[key], key);
      }
    }
  },
  map(arr, callback) {
    return arr.map(callback);
  },
  filter(arr, callback) {
    return arr.filter(callback);
  },
  keys(obj) {
    return Object.keys(obj);
  },
  include(arr, val) {
    return arr.indexOf(val) != -1;
  },
  remove(arr, pred) {
    for (let i = arr.length - 1; i >= 0; i--) {
      if (pred(arr[i], i)) {
        arr.splice(i, 1);
      }
    }
  },
  slice(arr, s, e) {
    return Array.prototype.slice.call(arr, s, e);
  },
  //处理 VBProxy对象(IE 6,7,8)
  checkObj(obj) {
    if (window.VBProxy && window.VBProxy.isVBProxy(obj)) {
      return window.VBProxy.getVBProxyDesc(obj).object;
    }
    return obj;
  },
  eq(obj, obj2) {
    return Util.checkObj(obj) === Util.checkObj(obj2);
  }
};
module.exports = Util;
