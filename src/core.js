import proxy from './proxyEvent'

const arrayHockMethods = ['push', 'pop', 'shift', 'unshift', 'sort', 'reverse', 'splice'];

export default class Observer {

  static eq(obj, obj2) {
    return proxy.obj(obj) === proxy.obj(obj2);
  }

  constructor(target) {
    if (target instanceof Array) {
      this.isArray = true;
    } else if (target && typeof target === 'object') {
      this.isArray = false;
    } else {
      throw TypeError('can not observe object[' + (typeof target) + ']');
    }
    this.target = target;
    this.watchers = {};
    this.listens = {};
    this.changeRecords = {};
    this._notify = this._notify.bind(this);
    this._onObserveChanged = this._onObserveChanged.bind(this);
    this._onStateChanged = this._onStateChanged.bind(this);
  }

  _notify() {
    let attr, val, oldVal, handlers, i;

    for (attr in this.changeRecords) {
      val = this.target[attr];
      oldVal = this.changeRecords[attr];
      if (!Observer.eq(val, oldVal)) {
        handlers = this.listens[attr];
        for (i = 0; i < handlers.length; i++) {
          handlers[i](attr, val, oldVal, this.target);
        }
      }
    }
    this.request_frame = null;
    this.changeRecords = {};
  }

  _addChangeRecord(attr, oldVal) {
    if (!(attr in this.changeRecords)) {
      this.changeRecords[attr] = oldVal;
      if (!this.request_frame)
        this.request_frame = requestAnimationFrame(this._notify);
    }
  }

  _onStateChanged(attr, oldVal) {
    this._addChangeRecord(attr, oldVal);
  }

  _onObserveChanged(changes) {
    for (let i = 0; i < changes.length; i++) {
      if (this.listens[changes[i].name])
        this._onStateChanged(changes[i].name, changes[i].oldValue);
    }
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
    proxy._fire(this.target);
  }

  _undefineProperty(attr, value) {
    this.target = Object.defineProperty(this.target, this.attr, {
      enumerable: true,
      configurable: true,
      value: value
    });
  }

  _hockArrayLength(method) {
    let fn = this.target[method];
    this.target[method] = () => {
      let len = this.target.length;

      fn.apply(this.target, arguments);
      if (this.target.length !== len)
        this._onStateChanged('length', len);
    }
    return fn;
  }

  _watch(attr) {
    if (Object.observe) {
      if (!this.es7observe) {
        Object.observe(this.target, this._onObserveChanged);
        this.es7observe = true;
      }
    } else if (!this.watchers[attr]) {
      if (this.isArray && attr === 'length') {
        this.arrayhocks = [];
        for (let i = 0; i < arrayHockMethods.length; i++) {
          this.arrayhocks[i] = this._hockArrayLength(arrayHockMethods[i]);
        }
      } else {
        this._defineProperty(attr, this.target[attr]);
      }
      this.watchers[attr] = true;
    }
  }

  _unwatch(attr) {
    if (Object.observe) {
      if (this.es7observe && !this.hasListen()) {
        Object.unobserve(this.target, this._onObserveChanged);
        this.es7observe = false;
      }
    } else if (this.watchers[attr]) {
      if (this._isArray && attr === 'length') {
        for (let i = 0; i < arrayHockMethods.length; i++) {
          this.target[method] = this.arrayhocks[i];
        }
        this.arrayhocks == [];
      } else {
        this._undefineProperty(attr, this.target[attr]);
      }
      delete this.watchers[attr];
    }
  }

  _addListen(attr, handler) {
    let _handlers = this.listens[attr];

    if (typeof handler !== 'function') {
      throw TypeError("Invalid Observer Handler", handler);
    }

    if (!_handlers)
      _handlers = this.listens[attr] = [];

    _handlers.push(handler);

    this._watch(attr);
  }

  _removeListen(attr, handler) {
    let _handlers, idx, i;

    if (attr in this.listens) {
      _handlers = this.listens[attr] || [];
      if (!handler) {
        _handlers = [];
      } else if ((idx = _handlers.indexOf(handler)) !== -1) {
        _handlers.splice(idx, 1);
      }
      if (!_handlers.length) {
        delete this.listens[attr];
        this._unwatch(attr);
      }
    }
  }


  hasListen() {
    for (let attr in this.listens) {
      return true;
    }
    return false;
  }

  on(attrs, handler) {
    if (arguments.length == 1) {
      if (typeof attrs === 'function') {
        for (let attr in this.target) {
          this._addListen(attr, attrs);
        }
      } else if (attrs && typeof attrs === 'object') {
        for (let attr in attrs) {
          handler = attrs[attr];
          if (typeof handler !== 'function') {
            throw TypeError("Invalid Observer Handler", handler);
          }
          this._addListen(attr, handler);
        }
      } else {
        throw TypeError('Invalid Parameter', arguments);
      }
    } else if (arguments.length >= 2) {
      let i;

      attrs = [];
      handler = undefined;
      for (i = 0; i < arguments.length; i++) {
        if (typeof arguments[i] === 'function') {
          handler = arguments[i];
          break;
        }
        if (arguments[i] instanceof Array) {
          attrs.push.apply(attrs, arguments[i]);
        } else {
          attrs.push(arguments[i]);
        }
      }
      if (!handler) {
        throw TypeError("Invalid Observer Handler", handler);
      }
      for (i = 0; i < attrs.length; i++) {
        this._addListen(attrs[i] + '', handler);
      }
    } else {
      throw TypeError('Invalid Parameter', arguments);
    }
    return this.target;
  }

  un(attrs, handler) {
    if (arguments.length == 0) {
      for (let attr in this.target) {
        this._removeListen(attr);
      }
    } else if (arguments.length == 1) {
      if (attrs instanceof Array) {
        for (let i = 0; i < attrs.length; i++) {
          this._removeListen(attrs[i] + '');
        }
      } else if (attrs && typeof attrs === 'object') {
        for (let attr in attrs) {
          this._removeListen(attr, attrs[attr]);
        }
      } else {
        this._removeListen(attrs + '');
      }
    } else if (arguments.length >= 2) {
      let i;

      attrs = [];
      handler = undefined;
      for (i = 0; i < arguments.length; i++) {
        if (typeof arguments[i] === 'function') {
          handler = arguments[i];
          break;
        }
        if (arguments[i] instanceof Array) {
          attrs.push.apply(attrs, arguments[i]);
        } else {
          attrs.push(arguments[i]);
        }
      }
      for (i = 0; i < attrs.length; i++) {
        this._removeListen(attrs[i] + '', handler);
      }
    } else {
      throw TypeError('Invalid Parameter', arguments);
    }
    return this.target;
  }

  destroy() {
    for (let attr in this.listens) {
      this._removeListen(attr);
    }
    if (this.request_frame) {
      cancelAnimationFrame(this.request_frame);
      this.request_frame = undefined;
    }
    this.target = undefined;
    this.watchers = undefined;
    this.listens = undefined;
    this.changeRecords = undefined;
  }
}
Observer.obj = proxy.obj;
