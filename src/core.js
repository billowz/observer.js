const {VBProxyFactory} = require('./VBProxy'),
  {proxy, proxyChange, proxyEnable} = require('./proxyEvent'),
  _ = require('./util');

const arrayHockMethods = ['push', 'pop', 'shift', 'unshift', 'sort', 'reverse', 'splice'];

class Observer {

  constructor(target) {
    if (target instanceof Array) {
      this.isArray = true;
    } else if (target && typeof target == 'object') {
      this.isArray = false;
    } else {
      throw TypeError('can not observe object[' + (typeof target) + ']');
    }
    this.target = target;
    this.listens = {};
    this.changeRecords = {};
    this._notify = _.bind.call(this._notify, this);
    this._init();
  }

  _fire(attr, val, oldVal) {
    let handlers = this.listens[attr].slice();

    for (let i = 0, l = handlers.length; i < l; i++) {
      handlers[i](attr, val, oldVal, this.target);
    }
  }

  _notify() {
    _.eachObj(this.changeRecords, (oldVal, attr) => {
      let val = this.target[attr];
      if (!proxy.eq(val, oldVal)) {
        this._fire(attr, val, oldVal);
      }
    });
    this.request_frame = undefined;
    this.changeRecords = {};
  }


  _addChangeRecord(attr, oldVal) {
    if (!Observer.lazy) {
      this._fire(attr, this.target[attr], oldVal);
    } else if (!(attr in this.changeRecords)) {
      this.changeRecords[attr] = oldVal;
      if (!this.request_frame)
        this.request_frame = _.requestAnimationFrame(this._notify);
    }
  }
  hasListen(attr, handler) {
    let l = arguments.length,
      listens = this.listens;
    if (!l) {
      for (let i in listens)
        return true;
      return false;
    } else if (l == 1) {
      console.log(attr)
      if (typeof attr == 'function') {
        for (let k in listens) {
          if (_.indexOf.call(listens[k], attr) != -1)
            return true;
        }
        return false;
      } else
        return !!listens[attr];
    } else {
      console.log(attr, handler)
      if (typeof handler != 'function') {
        throw TypeError('Invalid Observe Handler');
      }
      return listens[attr] && _.indexOf.call(listens[attr], handler) != -1;
    }
  }

  on(attr, handler) {
    if (typeof handler != 'function') {
      throw TypeError('Invalid Observe Handler');
    }

    let handlers = this.listens[attr];

    if (!handlers) {
      this.listens[attr] = [handler];
      this._watch(attr);
    } else
      handlers.push(handler);
    return this.target;
  }

  _cleanListen(attr) {
    delete this.listens[attr];
    this._unwatch(attr);
  }

  un(attr, handler) {
    let handlers = this.listens[attr];
    if (handlers) {
      if (arguments.length == 1) {
        this._cleanListen(attr);
      } else {
        if (typeof handler != 'function')
          throw TypeError('Invalid Observe Handler');

        for (let i = handlers.length - 1; i >= 0; i--) {
          if (handlers[i] === handler) {
            handlers.splice(i, 1);
            if (!handlers.length)
              this._cleanListen(attr);
            break;
          }
        }
      }
    }
    return this.target;
  }

  destroy() {
    if (this.request_frame) {
      _.cancelAnimationFrame(this.request_frame);
      this.request_frame = undefined;
    }
    this._destroy();
    this.target = undefined;
    this.listens = undefined;
    this.changeRecords = undefined;
  }
}

Observer.lazy = false;

function applyProto(name, fn) {
  Observer.prototype[name] = fn;
}

function es7Observe() {
  applyProto('_init', function _init() {
    this._onObserveChanged = _.bind.call(this._onObserveChanged, this);
  });

  applyProto('_destroy', function _destroy() {
    if (this.es7observe) {
      Object.unobserve(this.target, this._onObserveChanged);
      this.es7observe = undefined;
    }
  });

  applyProto('_onObserveChanged', function _onObserveChanged(changes) {
    let c;
    for (let i = 0, l = changes.length; i < l; i++) {
      c = changes[i];
      if (this.listens[c.name])
        this._addChangeRecord(c.name, c.oldValue);
    }
  });

  applyProto('_watch', function _watch(attr) {
    if (!this.es7observe) {
      Object.observe(this.target, this._onObserveChanged);
      this.es7observe = true;
    }
  });

  applyProto('_unwatch', function _unwatch(attr) {
    if (this.es7observe && !this.hasListen()) {
      Object.unobserve(this.target, this._onObserveChanged);
      this.es7observe = false;
    }
  });
}

function es6Proxy() {
  applyProto('_init', function _init() {
    this._onObserveChanged = _.bind.call(this._onObserveChanged, this);
  });

  applyProto('_destroy', function _destroy() {
    if (this.es7observe) {
      Object.unobserve(this.target, this._onObserveChanged);
      this.es7observe = undefined;
    }
  });

  applyProto('_onObserveChanged', function _onObserveChanged(changes) {
    let c;
    for (let i = 0, l = changes.length; i < l; i++) {
      c = changes[i];
      if (this.listens[c.name])
        this._addChangeRecord(c.name, c.oldValue);
    }
  });

  applyProto('_watch', function _watch(attr) {
    if (!this.es7observe) {
      Object.observe(this.target, this._onObserveChanged);
      this.es7observe = true;
    }
  });

  applyProto('_unwatch', function _unwatch(attr) {
    if (this.es7observe && !this.hasListen()) {
      Object.unobserve(this.target, this._onObserveChanged);
      this.es7observe = false;
    }
  });
}

function es5DefineProperty() {
  applyProto('_init', function _init() {
    this.watchers = {};
  });

  applyProto('_destroy', function _destroy() {
    for (let attr in this.watchers) {
      this._unwatch(attr);
    }
  });

  applyProto('_hockArrayLength', function _hockArrayLength(method) {
    let self = this;

    this.target[method] = function() {
      let len = this.length;

      Array.prototype[method].apply(this, arguments);
      if (self.target.length != len)
        self._addChangeRecord('length', len);
    }
  });

  applyProto('_watch', function _watch(attr) {
    if (!this.watchers[attr]) {
      if (this.isArray && attr === 'length') {
        for (let i = 0, l = arrayHockMethods.length; i < l; i++) {
          this._hockArrayLength(arrayHockMethods[i]);
        }
      } else {
        this._defineProperty(attr, this.target[attr]);
      }
      this.watchers[attr] = true;
    }
  });

  applyProto('_unwatch', function _unwatch(attr) {
    if (this.watchers[attr]) {
      if (this.isArray && attr === 'length') {
        for (let i = 0, l = arrayHockMethods.length; i < l; i++) {
          delete this.target[arrayHockMethods[i]];
        }
      } else {
        this._undefineProperty(attr, this.target[attr]);
      }
      delete this.watchers[attr];
    }
  });

  function doesDefinePropertyWork(defineProperty, object) {
    try {
      let val;
      defineProperty(object, 'sentinel', {
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
  }

  if (Object.defineProperty && doesDefinePropertyWork(Object.defineProperty, {})) {
    applyProto('_defineProperty', function _defineProperty(attr, value) {
      this.target = Object.defineProperty(this.target, attr, {
        enumerable: true,
        configurable: true,
        get: () => {
          return value;
        },
        set: (val) => {
          if (value !== val) {
            let oldVal = value;
            value = val;
            this._addChangeRecord(attr, oldVal);
          }
        }
      });
    });

    applyProto('_undefineProperty', function _undefineProperty(attr, value) {
      this.target = Object.defineProperty(this.target, attr, {
        enumerable: true,
        configurable: true,
        writable: true,
        value: value
      });
    });
  } else if ('__defineGetter__' in {}) {
    applyProto('_defineProperty', function _defineProperty(attr, value) {
      this.target.__defineGetter__(attr, () => {
        return value;
      });
      this.target.__defineSetter__(attr, (val) => {
        if (value !== val) {
          let oldVal = value;
          value = val;
          this._addChangeRecord(attr, oldVal);
        }
      });
    });

    applyProto('_undefineProperty', function _undefineProperty(attr, value) {
      this.target.__defineGetter__(attr, () => {
        return value;
      });
      this.target.__defineSetter__(attr, (val) => {
        value = val;
      });
    });
  } else if (VBProxyFactory.isSupport()) {
    let factory = Observer.VBProxyFactory = new VBProxyFactory(proxyChange);
    proxyEnable();
    proxy.obj = factory.obj;
    proxy.eq = factory.eq;
    proxy.proxy = factory.getVBProxy;

    applyProto('_defineProperty', function _defineProperty(attr, value) {
      let obj = factory.obj(this.target),
        desc = factory.getVBProxyDesc(obj);

      if (!desc) {
        desc = factory.getVBProxyDesc(factory.createVBProxy(obj))
      }
      this.target = desc.defineProperty(attr, {
        get: () => {
          return value;
        },
        set: (val) => {
          if (value !== val) {
            let oldVal = value;
            value = val;
            this._addChangeRecord(attr, oldVal);
          }
        }
      });
    });

    applyProto('_undefineProperty', function _undefineProperty(attr, value) {
      let obj = factory.obj(this.target),
        desc = factory.getVBProxyDesc(obj);

      if (desc) {
        this.target = desc.defineProperty(attr, {
          value: value
        });
        if (!desc.hasAccessor()) {
          this.target = factory.freeVBProxy(obj);
        }
      }
    });

  } else {
    throw new Error('Not Supported.');
  }
}

if (Object.observe) {
  es7Observe();
} else if (window.Proxy) {
  es6Proxy();
} else {
  es5DefineProperty();
}
module.exports = Observer;
