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
    this.obj = target;
    this.listens = {};
    this.changeRecords = {};
    this._notify = _.bind.call(this._notify, this);
    this.watchPropNum = 0;
    this._init();
  }

  _fire(attr, val, oldVal) {
    if (proxy.eq(val, oldVal))
      return;
    let handlers = this.listens[attr].slice();

    for (let i = 0, l = handlers.length; i < l; i++) {
      handlers[i](attr, val, oldVal, this.target);
    }
  }

  _notify() {
    let changeRecords = this.changeRecords;
    for (let attr in changeRecords) {
      this._fire(attr, this.obj[attr], changeRecords[attr]);
    }
    this.request_frame = undefined;
    this.changeRecords = {};
  }

  _addChangeRecord(attr, oldVal) {
    if (!Observer.lazy) {
      this._fire(attr, this.obj[attr], oldVal);
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
      return !!this.watchPropNum;
    } else if (l == 1) {
      if (typeof attr == 'function') {
        let handlers;
        for (let k in listens) {
          handlers = listens[k]
          if (handlers && _.indexOf.call(handlers, attr) != -1)
            return true;
        }
        return false;
      } else
        return !!listens[attr];
    } else {
      if (typeof handler != 'function') {
        throw TypeError('Invalid Observe Handler');
      }
      let handlers = listens[attr];
      return handlers && _.indexOf.call(handlers, handler) != -1;
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
      this.watchPropNum++;
    } else
      handlers.push(handler);
    return this.target;
  }

  _cleanListen(attr) {
    this.listens[attr] = undefined;
    this._unwatch(attr);
    this.watchPropNum--;
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
    this.obj = undefined;
    this.target = undefined;
    this.listens = undefined;
    this.changeRecords = undefined;
  }
}

Observer.lazy = true;

function applyProto(name, fn) {
  Observer.prototype[name] = fn;
  return fn;
}

function es7Observe() {
  applyProto('_init', function _init() {
    this._onObserveChanged = _.bind.call(this._onObserveChanged, this);
    this.es7observe = false;
  });

  applyProto('_destroy', function _destroy() {
    if (this.es7observe) {
      Object.unobserve(this.target, this._onObserveChanged);
      this.es7observe = false;
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
  let objProxyLoop = new Map(),
    proxyObjLoop = new Map();

  proxyEnable();

  proxy.obj = function(proxy) {
    return proxyObjLoop.get(proxy) || proxy;
  };

  proxy.eq = function(obj1, obj2) {
    return proxy.obj(obj1) === proxy.obj(obj2);
  };

  proxy.proxy = function(obj) {
    return objProxyLoop.get(obj);
  };

  applyProto('_init', function _init() {
    this.obj = proxy.obj(this.target);
    this.es6proxy = false;
    this.watchLen = false;
  });

  applyProto('_destroy', function _destroy() {
    if (this.watchLen) {
      for (let i = 0, l = arrayHockMethods.length; i < l; i++) {
        delete this.obj[arrayHockMethods[i]];
      }
      this.watchLen = false;
    }
    if (this.es6proxy) {
      proxyObjLoop['delete'](this.target);
      objProxyLoop['delete'](this.obj);
      proxyChange(this.obj, undefined);
      this.es6proxy = false;
    }
    this.obj = undefined;
  });

  applyProto('_hockArrayLength', function _hockArrayLength(method) {
    let self = this;

    this.obj[method] = function() {
      let len = this.length;

      Array.prototype[method].apply(this, arguments);
      if (self.obj.length != len)
        self._addChangeRecord('length', len);
    }
  });

  applyProto('_watch', function _watch(attr) {
    if (this.isArray && attr === 'length') {
      if (!this.watchLen) {
        this.watchLen = true;
        for (let i = 0, l = arrayHockMethods.length; i < l; i++) {
          this._hockArrayLength(arrayHockMethods[i]);
        }
      }
    } else if (!this.es6proxy) {
      let proxy = this.target = new Proxy(this.obj, {
        set: (obj, prop, value) => {
          this.isArray && attr === 'length'
          if (!(this.isArray && attr === 'length')
            && this.listens[prop]) {

            let oldVal = obj[prop];
            obj[prop] = value;
            if (value !== oldVal)
              this._addChangeRecord(prop, oldVal);
          } else
            obj[prop] = value;
          return true;
        }
      });
      proxyObjLoop.set(proxy, this.obj);
      objProxyLoop.set(this.obj, proxy);
      proxyChange(this.obj, proxy);
      this.es6proxy = true;
    }
  });

  applyProto('_unwatch', function _unwatch(attr) {
    if (this.isArray && attr === 'length') {
      if (this.watchLen) {
        for (let i = 0, l = arrayHockMethods.length; i < l; i++) {
          delete this.obj[arrayHockMethods[i]];
        }
        this.watchLen = false;
      }
    }
    if (this.es6proxy && !this.hasListen()) {
      proxyObjLoop['delete'](this.target);
      objProxyLoop['delete'](this.obj);
      this.target = this.obj;
      proxyChange(this.obj, undefined);
      this.es6proxy = false;
    }
  });
}

function es5DefineProperty() {
  let init = applyProto('_init', function _init() {
    this.watchers = {};
  });

  let destroy = applyProto('_destroy', function _destroy() {
    for (let attr in this.watchers) {
      if (this.watchers[attr])
        this._unwatch(attr);
    }
    this.watchers = undefined;
  });

  applyProto('_hockArrayLength', function _hockArrayLength(method) {
    let self = this;

    this.obj[method] = function() {
      let len = this.length;

      Array.prototype[method].apply(this, arguments);
      if (self.obj.length != len)
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
        this._defineProperty(attr, this.obj[attr]);
      }
      this.watchers[attr] = true;
    }
  });

  applyProto('_unwatch', function _unwatch(attr) {
    if (this.watchers[attr]) {
      if (this.isArray && attr === 'length') {
        for (let i = 0, l = arrayHockMethods.length; i < l; i++) {
          delete this.obj[arrayHockMethods[i]];
        }
      } else {
        this._undefineProperty(attr, this.obj[attr]);
      }
      this.watchers[attr] = false;
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
      Object.defineProperty(this.target, attr, {
        enumerable: true,
        configurable: true,
        get: () => {
          return value;
        },
        set: (val) => {
          let oldVal = value;
          value = val;
          this._addChangeRecord(attr, oldVal);
        }
      });
    });

    applyProto('_undefineProperty', function _undefineProperty(attr, value) {
      Object.defineProperty(this.target, attr, {
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
        let oldVal = value;
        value = val;
        this._addChangeRecord(attr, oldVal);
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

    applyProto('_init', function _init() {
      init();
      this.obj = factory.obj(this.target);
    });

    applyProto('_destroy', function _destroy() {
      destroy();
      this.obj = undefined;
    });

    applyProto('_defineProperty', function _defineProperty(attr, value) {
      let obj = this.obj,
        desc = factory.getVBProxyDesc(obj);

      if (!desc)
        desc = factory.getVBProxyDesc(factory.createVBProxy(obj))
      this.target = desc.defineProperty(attr, {
        get: () => {
          return value;
        },
        set: (val) => {
          let oldVal = value;
          value = val;
          this._addChangeRecord(attr, oldVal);
        }
      });
    });

    applyProto('_undefineProperty', function _undefineProperty(attr, value) {
      let obj = this.obj,
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
