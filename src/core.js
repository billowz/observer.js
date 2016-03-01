const arrayHockMethods = ['push', 'pop', 'shift', 'unshift', 'sort', 'reverse', 'splice'];

export default class Observer {

  static obj(obj) {
    if (window.VBProxy && window.VBProxy.isVBProxy(obj))
      return window.VBProxy.getVBProxyDesc(obj).object;
    return obj;
  }

  static eq(obj, obj2) {
    return Observer.obj(obj) === Observer.obj(obj2);
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
        this._onStateChanged(attr, len);
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
      throw TypeError("Invalid Observer Handler ", handler);
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
      if (!attrs) {
        throw Error('Invalid Parameter ', arguments);
      } else if (typeof attrs === 'function') {
        for (let attr in this.target) {
          this._addListen(attr, attrs);
        }
      } else {
        let str, _attrs;

        for (str in attrs) {
          handler = attrs[str];
          if (typeof handler !== 'function') {
            throw TypeError("Invalid Observer Handler ", handler);
          }
          if (!str) {
            for (let attr in this.target) {
              this._addListen(attr, handler);
            }
          } else {
            this._addListen(str, handler);
          }
        }
      }
    } else if (arguments.length >= 2) {
      if (!(attrs instanceof Array)) {
        attrs = [attrs + ''];
      }
      if (typeof handler !== 'function') {
        throw TypeError("Invalid Observer Handler ", handler);
      }
      for (let i = 0; i < attrs.length; i++) {
        this._addListen(attrs[i], handler);
      }
    } else {
      throw Error('Invalid Parameter ', arguments);
    }
    return this.target;
  }

  un(attrs, handler) {
    if (arguments.length == 0) {
      for (let attr in this.target) {
        this._removeListen(attr);
      }
    } else if (arguments.length == 1) {
      if (!attrs) {
        for (let attr in this.target) {
          this._removeListen(attr);
        }
      } else if (typeof attrs === 'string') {
        this._removeListen(attrs);
      } else if (attrs instanceof Array) {
        for (let attr in this.target) {
          this._removeListen(attr, attrs);
        }
      } else {
        let str, _attrs;

        for (str in attrs) {
          handler = attrs[str];
          if (!str) {
            for (let attr in this.target) {
              this._removeListen(attr, handler);
            }
          } else {
            this._removeListen(str, handler);
          }
        }
      }
    } else if (arguments.length >= 2) {
      if (!(attrs instanceof Array)) {
        attrs = [attrs + ''];
      }
      for (let i = 0; i < attrs.length; i++) {
        this._removeListen(attrs[i], handler);
      }
    } else {
      throw Error('Invalid Parameter ', arguments);
    }
    return this.target;
  }

  destory() {
    for (let attr in this.listens) {
      this._removeListen(attr);
    }
  }
}
