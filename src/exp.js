const observer = require('./factory'),
  _ = require('./util');

const reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
  reIsPlainProp = /^\w*$/,
  rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;

function baseToString(val) {
  return (val === undefined || val === null) ? '' : (val + '');
}

class Expression {
  static toPath(value) {
    let result = [];
    if (value instanceof Array) {
      result = value;
    } else if (value !== undefined && value !== null) {
      (value + '').replace(rePropName, function(match, number, quote, string) {
        result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
      });
    }
    return result;
  }

  constructor(target, expression, path) {
    if (!target || !(target instanceof Array || typeof target === 'object')) {
      throw TypeError('can not observe object[' + (typeof target) + ']');
    }
    this.expression = expression;
    this.handlers = [];
    this.path = path || Expression.toPath(expression);
    this.observers = [];
    this.observeHandlers = this._initObserveHandlers();
    this.target = this._observe(target, 0);
  }

  static get(object, path, defaultValue) {
    if (object) {
      path = Expression.toPath(path);
      var index = 0;

      while (object && index < path.length) {
        object = object[path[index++]];
      }
      return (index === path.length) ? object : undefined;
    }
    return defaultValue;
  }

  _observe(obj, idx) {
    let attr = this.path[idx];

    if (idx + 1 < this.path.length) {
      if (obj[attr])
        obj[attr] = this._observe(obj[attr], idx + 1);
    }
    return observer.on(obj, attr, this.observeHandlers[idx]);
  }

  _unobserve(obj, idx) {
    let attr = this.path[idx];

    obj = observer.un(obj, attr, this.observeHandlers[idx]);
    if (idx + 1 < this.path.length)
      obj[attr] = this._unobserve(obj[attr], idx + 1);
    return obj;
  }


  _initObserveHandlers() {
    let handlers = [], i;

    for (i = 0; i < this.path.length; i++) {
      handlers.push(this._createObserveHandler(i));
    }
    return handlers;
  }

  _createObserveHandler(idx) {
    let path = this.path.slice(0, idx + 1),
      rpath = this.path.slice(idx + 1),
      ridx = this.path.length - idx - 1;

    return (attr, val, oldVal) => {
      if (ridx > 0) {
        this._unobserve(oldVal, idx + 1);
        this._observe(val, idx + 1);
        oldVal = Expression.get(oldVal, rpath);
        val = Expression.get(val, rpath);
      }
      if (val !== oldVal && this.handlers) {
        let hs = this.handlers.slice();
        for (let i = 0; i < hs.length; i++) {
          this.handlers[i](this.expression, val, oldVal, this.target);
        }
      }
    }
  }

  addListen() {
    for (let i = 0; i < arguments.length; i++) {
      if (typeof arguments[i] === 'function') {
        this.handlers.push(arguments[i]);
      }
    }
  }

  removeListen() {
    if (arguments.length == 0) {
      this.handlers = [];
    } else {
      for (let i = 0; i < arguments.length; i++) {
        if (typeof arguments[i] === 'function') {
          let idx = _.indexOf.call(this.handlers, arguments[i]);
          if (idx !== -1) {
            this.handlers.splice(idx, 1);
          }
        }
      }
    }
  }

  hasListen(handler) {
    if (arguments.length)
      return _.indexOf.call(this.handlers, handler) !== -1;
    return !!this.handlers.length;
  }

  destory() {
    let obj = this._unobserve(this.target, 0);
    this.target = undefined;
    this.expression = undefined;
    this.handlers = undefined;
    this.path = undefined;
    this.observers = undefined;
    this.observeHandlers = undefined;
    this.target = undefined;
    return obj;
  }
}
module.exports = Expression;
