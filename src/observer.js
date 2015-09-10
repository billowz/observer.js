const _ = require('lodash'),
  ARRAY_METHODS = ['push', 'pop', 'shift', 'unshift', 'sort', 'reverse', 'splice'],
  prefixes = 'webkit moz ms o'.split(' '),
  getFrame = function getFrame(prop, defaultVal) {
    let ret = window[prop];
    if (!ret) {
      prop = _.capitalize(prop);
      prop = _.find(prefixes, prefix => {
        return window[prefix + prop];
      })
      ret = prop ? window[prop] : null;
    }
    return ret || defaultVal;
  },
  requestFrame = getFrame('requestAnimationFrame', function requestAnimationFrame(callback) {
    let currTime = new Date().getTime(),
      timeToCall = Math.max(0, 16 - (currTime - lastTime)),
      reqId = setTimeout(function() {
        callback(currTime + timeToCall);
      }, timeToCall);
    lastTime = currTime + timeToCall;
    return reqId;
  }).bind(window);

let _observers = new Map(),
  lastTime = 0,
  cfg = {
    useES7Observe: true
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

class State {
  constructor(target, attr, onChange) {
    this.target = target;
    this.attr = attr;
    this.onChange = onChange;
    this.define = Object.getOwnPropertyDescriptor(target, attr) || {
        enumerable: true,
        configurable: true,
        writable: true,
        value: target[attr]
    };
  }


  getValue() {
    if (this.define.get) {
      return this.define.get.call(this.target);
    } else {
      return this.define.value;
    }
  }

  setValue(value) {
    let oldValue = this.getValue();
    if (value !== oldValue) {
      if (this.define.set) {
        this.define.set.call(this.target, value);
      } else {
        this.define.value = value;
      }
      this.onChange(this.attr, oldValue);
    }
  }

  bind() {
    if (!this._binded) {
      let object = Object.defineProperty(this.target, this.attr, {
        enumerable: true,
        configurable: true,
        get: this.getValue.bind(this),
        set: this.setValue.bind(this)
      });
      this.target = object;
      this._binded = true;
    }
    return this;
  }

  unbind() {
    if (this._binded) {
      this.target = Object.defineProperty(this.target, this.attr, this.define);
      this._binded = false;
    }
    return this;
  }

  isBinded() {
    return !!this._binded;
  }
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
    _.map(this.changeRecords, (oldVal, attr) => {
      let handlers = this.listens[attr];
      _.each(handlers, h => {
        h(attr, this.target[attr], oldVal, this.target);
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
      console.log('changed:', attr, ' ', oldVal)
      this._addChangeRecord(attr, oldVal);
    }
  }

  _onObserveChanged(changes) {
    _.each(changes, change => {
      this._onStateChanged(change.name, change.oldValue);
    });
  }

  _watch(attr) {
    if (Object.observe && cfg.useES7Observe) {
      if (!this._es7observe) {
        Object.observe(this.target, this._onObserveChanged);
        this._es7observe = true;
      }
    } else if (!this.watchers[attr]) {
      this.watchers[attr] = new State(this.target, attr, this._onStateChanged.bind(this)).bind();
      this.target = this.watchers[attr].target;
    }
  }

  _unwatch(attr) {
    if (Object.observe && cfg.useES7Observe) {
      if (this._es7observe && this.hasListen()) {
        Object.unobserve(this.target, this._onObserveChanged);
        _es7observe = false;
      }
    } else if (this.watchers[attr]) {
      this.watchers[attr].unbind();
      this.target = this.watchers[attr].target;
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
      _.each(arg.attrs, attr => {
        if (this.target.__proxy__) {
          let obj = this.target.__proxy__.object;
          if (!(attr in obj)) {
            obj[attr] = undefined;
          }
        }
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
class Expression {
  constructor(target, expression, handler) {
    this.target = target;
    this.expression = expression;
    this.handler = handler;
    this.observers = [];
  }
  parsePath() {}
  destory() {}
}
module.exports = {
  on(obj) {
    // VB Proxy
    if (obj.__proxy__) {
      obj = obj.__proxy__.object;
    }

    let observer = getBindObserver(obj);
    if (!observer) {
      observer = new Observer(obj);
    }
    let ret = observer.on.apply(observer, _.slice(arguments, 1));
    if (!observer.hasListen()) {
      observer.destory();
    }
    return ret;
  },

  un(obj) {
    let observer = getBindObserver(obj);
    if (observer) {
      let ret = observer.un.apply(observer, _.slice(arguments, 1));
      if (!observer.hasListen()) {
        observer.destory();
      }
      return ret;
    }
  },

  _getObserver(obj) {
    return getBindObserver(obj);
  },

  cfg: cfg,

  support: !!Object.observe || Object.defineProperty && (function() {
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
    })() || window.supportDefinePropertyOnObject
};
