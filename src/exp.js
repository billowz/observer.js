const observer = require('./factory'),
  {proxy} = require('./proxyEvent'),
  _ = require('./util');

const reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
  reIsPlainProp = /^\w*$/,
  rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;

function baseToString(val) {
  return (val === undefined || val === null) ? '' : (val + '');
}

class Expression {
  static _parseExpr(exp) {
    if (exp instanceof Array) {
      return exp;
    } else {
      let result = [];
      (exp + '').replace(rePropName, function(match, number, quote, string) {
        result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
      });
      return result;
    }
  }

  static get(object, path, defaultValue) {
    if (object) {
      path = Expression._parseExpr(path);
      var index = 0;

      while (object && index < path.length) {
        object = object[path[index++]];
      }
      return (index == path.length) ? object : undefined;
    }
    return defaultValue;
  }

  constructor(target, expression, path) {
    if (!target || !(target instanceof Array || typeof target == 'object')) {
      throw TypeError('can not observe object[' + (typeof target) + ']');
    }
    this.expression = expression;
    this.handlers = [];
    this.path = path || Expression._parseExpr(expression);
    this.observers = [];
    this.observeHandlers = this._initObserveHandlers();
    this.target = this._observe(target, 0);
    this._onTargetProxy = _.bind.call(this._onTargetProxy, this);
    proxy.on(target, this._onTargetProxy);
  }

  _onTargetProxy(obj, proxy) {
    this.target = proxy;
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
    let handlers = [];

    for (let i = 0, l = this.path.length; i < l; i++) {
      handlers.push(this._createObserveHandler(i));
    }
    return handlers;
  }

  _createObserveHandler(idx) {
    let path = this.path.slice(0, idx + 1),
      rpath = this.path.slice(idx + 1),
      ridx = this.path.length - idx - 1;

    return (attr, val, oldVal) => {
      if (ridx) {
        this._unobserve(oldVal, idx + 1);
        this._observe(val, idx + 1);
        oldVal = Expression.get(oldVal, rpath);
        val = Expression.get(val, rpath);
        if (proxy.eq(val, oldVal))
          return;
      }

      let hs = this.handlers.slice();

      for (let i = 0, l = hs.length; i < l; i++) {
        hs[i](this.expression, val, oldVal, this.target);
      }
    }
  }

  on(handler) {
    if (typeof handler != 'function') {
      throw TypeError('Invalid Observe Handler');
    }
    this.handlers.push(handler);
    return this;
  }

  un(handler) {
    if (!arguments.length) {
      this.handlers = [];
    } else {
      if (typeof handler != 'function') {
        throw TypeError('Invalid Observe Handler');
      }

      let handlers = this.handlers;

      for (let i = handlers.length - 1; i >= 0; i--) {
        if (handlers[i] === handler) {
          handlers.splice(i, 1);
          break;
        }
      }
    }
    return this;
  }

  hasListen(handler) {
    if (arguments.length)
      return _.indexOf.call(this.handlers, handler) != -1;
    return !!this.handlers.length;
  }

  destory() {
    proxy.un(this.target, this._onTargetProxy);
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
