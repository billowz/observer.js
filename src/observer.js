/**
 * 监控对象属性变化
 * 高版本浏览器(Chrome 36+, Opera 23+)基于 Object.observe(ES7)实现
 * 基于浏览器使用 Object.defineProperty实现
 * IE 6,7,8使用VBScript实现Object.defineProperty
 */
const _ = require('lodash'),
  ARRAY_METHODS = ['push', 'pop', 'shift', 'unshift', 'sort', 'reverse', 'splice'],
  requestTimeoutFrame = function requestTimeoutFrame(callback) {
    let currTime = new Date().getTime(),
      timeToCall = Math.max(0, cfg.timeoutFrameInterval - (currTime - lastTime)),
      reqId = setTimeout(function() {
        callback(currTime + timeToCall);
      }, timeToCall);
    lastTime = currTime + timeToCall;
    return reqId;
  },
  requestFrame = function requestFrame(callback) {
    if (window.requestAnimationFrame && cfg.useAnimationFrame) {
      return window.requestAnimationFrame(callback);
    } else {
      return requestTimeoutFrame(callback);
    }
  };

let _observers = new Map(),
  lastTime = 0,
  cfg = {
    useES7Observe: true,
    useAnimationFrame: false,
    timeoutFrameInterval: 16
  };

function bindObserver(observer) {
  if (observer._binded !== true) {
    _observers.set(observer.target, observer);
    observer._binded = true;
  }
}

function unbindObserver(observer) {
  if (observer._binded === true) {
    if (_observers.get(observer.target) === observer) {
      _observers.delete(observer.target);
    }
    observer._binded = false;
  }
}

function getBindObserver(target) {
  return _observers.get(target);
}

//处理 VBProxy对象(IE 6,7,8)
function checkObj(obj) {
  if (_.isObject(obj) && window.VBProxy && window.VBProxy.isVBProxy(obj)) {
    obj = window.VBProxy.getVBProxyDesc(obj).object;
  }
  return obj;
}

class Observer {
  constructor(target) {
    if (!_.isArray(target) && !_.isObject(target)) {
      throw TypeError('can not observe object[' + (typeof target) + ']');
    }
    this.target = target;
    this.watchers = {};
    this.listens = {};
    this._onObserveChanged = this._onObserveChanged.bind(this);
    this._notify = this._notify.bind(this);
    this.changeRecords = {};
    bindObserver(this);
  }

  _notify() {
    _.each(this.changeRecords, (oldVal, attr) => {
      let handlers = this.listens[attr];
      _.each(handlers, h => {
        let val = this.target[attr];
        if (checkObj(val) !== checkObj(oldVal)) {
          h(attr, this.target[attr], oldVal, this.target);
        }
      })
    });
    this.__request_frame = null;
    this.changeRecords = {};
  }

  _addChangeRecord(attr, oldVal) {
    if (!(attr in this.changeRecords)) {
      this.changeRecords[attr] = oldVal;
      if (!this.__request_frame) {
        this.__request_frame = requestFrame(this._notify);
      }
    }
  }

  _addListen(attr, handlers) {
    let attrHandlers = this.listens[attr];
    if (!attrHandlers) {
      attrHandlers = this.listens[attr] = [];
    }
    _.each(handlers, (h) => {
      if (!_.include(attrHandlers, h)) {
        attrHandlers.push(h);
      }
    });
    if (attrHandlers.length) {
      this._watch(attr);
    }
  }

  _removeListen(attr, handlers) {
    let attrHandlers = this.listens[attr];
    if (attrHandlers) {
      if (handlers.length) {
        _.remove(attrHandlers, (h) => {
          return _.include(handlers, h);
        });
      }
      if (!handlers.length || !attrHandlers.length) {
        delete this.listens[attr];
        this._unwatch(attr);
      }
    }
  }

  _onStateChanged(attr, oldVal) {
    if (attr in this.listens) {
      this._addChangeRecord(attr, oldVal);
    }
  }

  _onObserveChanged(changes) {
    _.each(changes, change => {
      this._onStateChanged(change.name, change.oldValue);
    });
  }

  _defineProperty(attr, value) {
    this.target = Object.defineProperty(this.target, attr, {
      enumerable: true,
      configurable: true,
      get: function() {
        return value;
      },
      set: (val) => {
        let oldVal = value;
        value = val;
        this._onStateChanged(attr, oldVal);
      }
    });
  }

  _undefineProperty(attr, value) {
    this.target = Object.defineProperty(this.target, this.attr, {
      enumerable: true,
      configurable: true,
      value: value
    });
  }

  _watch(attr) {
    if (Object.observe && cfg.useES7Observe) {
      if (!this._es7observe) {
        Object.observe(this.target, this._onObserveChanged);
        this._es7observe = true;
      }
    } else if (!this.watchers[attr]) {
      this._defineProperty(attr, this.target[attr]);
      this.watchers[attr] = true;
    }
  }

  _unwatch(attr) {
    if (Object.observe && cfg.useES7Observe) {
      if (this._es7observe && !this.hasListen()) {
        Object.unobserve(this.target, this._onObserveChanged);
        this._es7observe = false;
      }
    } else if (this.watchers[attr]) {
      this._undefineProperty(attr, this.target[attr]);
      delete this.watchers[attr];
    }
  }

  _parseBindArg(attrs, handlers) {
    if (arguments.length == 1) {
      handlers = attrs;
      attrs = _.keys(this.target);
    } else if (!_.isArray(attrs)) {
      attrs = [attrs + ''];
    } else {
      attrs = _.map(attrs, attr => {
        return attr + '';
      });
    }
    if (!_.isArray(handlers)) {
      handlers = [handlers];
    }
    handlers = _.filter(handlers, (h) => {
      return _.isFunction(h);
    });
    return {
      attrs: attrs,
      handlers: handlers
    };
  }

  hasListen() {
    return _.findKey(this.listens);
  }

  on() {
    let arg = this._parseBindArg.apply(this, arguments);
    if (arg.attrs.length && arg.handlers.length) {
      let obj = checkObj(this.target);
      _.each(arg.attrs, attr => {
        if (!(attr in obj)) {
          obj[attr] = undefined;
        }
      });
      _.each(arg.attrs, attr => {
        this._addListen(attr, arg.handlers);
      });
    }
    return this.target;
  }

  un() {
    let arg = this._parseBindArg.apply(this, arguments);
    if (arg.attrs.length) {
      _.each(arg.attrs, attr => {
        this._removeListen(attr, arg.handlers);
      });
    }
    return this.target;
  }

  destory() {
    if (Object.observe && cfg.useES7Observe) {
      Object.unobserve(this.target, this._onObserveChanged);
      this.listens = {};
    } else {
      _.each(this.watchers, (state) => {
        state.unbind();
      });
      this.watchers = {};
    }
    unbindObserver(this);
  }
}

function observe(obj) {
  let target = checkObj(obj),
    observer = getBindObserver(target),
    ret;
  if (!observer) {
    observer = new Observer(target);
  }
  ret = observer.on.apply(observer, _.slice(arguments, 1));
  if (!observer.hasListen()) {
    observer.destory();
  }
  return ret;
}

function unobserve(obj) {
  let target = checkObj(obj);
  let observer = getBindObserver(target);
  if (observer) {
    let ret = observer.un.apply(observer, _.slice(arguments, 1));
    if (!observer.hasListen()) {
      observer.destory();
    }
    return ret;
  }
}

module.exports = {
  checkObj: checkObj,
  observe: observe,
  unobserve: unobserve,
  cfg: cfg,
  support: !!Object.observe || (window.supportDefinePropertyOnObject !== undefined ? window.supportDefinePropertyOnObject : (function() {
      if (!Object.defineProperty) {
        return false;
      }
      try {
        let val;
        Object.defineProperty(object, 'sentinel', {
          get() {
            return val;
          },
          set(value) {
            val = value;
          }
        });
        object.sentinel = 1;
        return object.sentinel === val;
      } catch (exception) {
        return false;
      }
    })())
};
