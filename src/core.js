const OBJECT = require('./defineProperty'),
  {proxy} = require('./proxyEvent'),
  _ = require('./util');

const arrayHockMethods = ['push', 'pop', 'shift', 'unshift', 'sort', 'reverse', 'splice'];

class Observer {

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
    this._notify = _.bind.call(this._notify, this);
    this._onObserveChanged = _.bind.call(this._onObserveChanged, this);
    this._onStateChanged = _.bind.call(this._onStateChanged, this);
  }

  _notify() {
    _.eachObj(this.changeRecords, (oldVal, attr) => {
      let val = this.target[attr];

      if (!proxy.eq(val, oldVal)) {
        let handlers = this.listens[attr].slice();

        for (let i = 0, l = handlers.length; i < l; i++) {
          handlers[i](attr, val, oldVal, this.target);
        }
      }
    });
    this.request_frame = null;
    this.changeRecords = {};
  }

  _addChangeRecord(attr, oldVal) {
    if (!(attr in this.changeRecords)) {
      this.changeRecords[attr] = oldVal;
      if (!this.request_frame)
        this.request_frame = _.requestAnimationFrame(this._notify);
    }
  }

  _onStateChanged(attr, oldVal) {
    this._addChangeRecord(attr, oldVal);
  }

  _onObserveChanged(changes) {
    for (let i = 0, l = changes.length; i < l; i++) {
      if (this.listens[changes[i].name])
        this._onStateChanged(changes[i].name, changes[i].oldValue);
    }
  }

  _defineProperty(attr, value) {
    this.target = OBJECT.defineProperty(this.target, attr, {
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
    this.target = OBJECT.defineProperty(this.target, attr, {
      enumerable: true,
      configurable: true,
      writable: true,
      value: value
    });
  }

  _hockArrayLength(method) {
    let self = this;

    this.target[method] = function() {
      let len = this.length;

      Array.prototype[method].apply(this, arguments);
      if (self.target.length !== len)
        self._onStateChanged('length', len);
    }
  }

  _watch(attr) {
    if (Object.observe) {
      if (!this.es7observe) {
        Object.observe(this.target, this._onObserveChanged);
        this.es7observe = true;
      }
    } else if (!this.watchers[attr]) {
      if (this.isArray && attr === 'length') {
        for (let i = 0, l = arrayHockMethods.length; i < l; i++) {
          this._hockArrayLength(arrayHockMethods[i]);
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
      if (this.isArray && attr === 'length') {
        for (let i = 0, l = arrayHockMethods.length; i < l; i++) {
          delete this.target[arrayHockMethods[i]];
        }
      } else {
        this._undefineProperty(attr, this.target[attr]);
      }
      delete this.watchers[attr];
    }
  }

  _addListen(attr, handler) {
    let _handlers = this.listens[attr];

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
      } else if ((idx = _.indexOf.call(_handlers, handler)) !== -1) {
        _handlers.splice(idx, 1);
      }
      if (!_handlers.length) {
        delete this.listens[attr];
        this._unwatch(attr);
      }
    }
  }


  hasListen(attr, handler) {
    if (arguments.length === 0) {
      return _.eachObj(this.listens, () => {
          return false;
        }) === false;
    } else if (arguments.length === 1) {
      if (typeof attr === 'function') {
        return _.eachObj(this.listens, (h, a) => {
            return _.indexOf.call(h, attr) === -1;
          }) === false;
      } else {
        return !!this.listens[attr];
      }
    } else {
      return this.listens[attr] && _.indexOf.call(this.listens[attr], handler) !== -1;
    }
  }

  on(attrs, handler) {
    if (arguments.length == 1) {
      if (typeof attrs === 'function') {
        if (this.isArray) {
          for (let i = 0, l = this.target.length; i < l; i++) {
            this._addListen(i + '', attrs);
          }
          this._addListen('length', attrs);
        } else {
          _.eachObj(this.target, (v, attr) => {
            this._addListen(attr, attrs);
          });
        }
      } else if (attrs && typeof attrs === 'object') {
        _.eachObj(attrs, (h, attr) => {
          if (typeof h !== 'function') {
            throw TypeError("Invalid Observer Handler", h);
          }
          this._addListen(attr, h);
        });
      } else {
        throw TypeError('Invalid Parameter', arguments);
      }
    } else if (arguments.length >= 2) {
      let i, l,
        _attrs = [],
        _handler = undefined;

      for (i = 0, l = arguments.length; i < l; i++) {
        if (typeof arguments[i] === 'function') {
          _handler = arguments[i];
          break;
        }
        if (arguments[i] instanceof Array) {
          _attrs.push.apply(_attrs, arguments[i]);
        } else {
          _attrs.push(arguments[i]);
        }
      }
      if (!_handler) {
        throw TypeError("Invalid Observer Handler", _handler);
      }
      for (i = 0, l = _attrs.length; i < l; i++) {
        this._addListen(_attrs[i] + '', _handler);
      }
    } else {
      throw TypeError('Invalid Parameter', arguments);
    }
    return this.target;
  }

  un(attrs, handler) {
    if (arguments.length == 0) {
      if (this.isArray) {
        for (let i = 0, l = this.target.length; i < l; i++) {
          this._removeListen(i + '');
        }
        this._removeListen('length');
      } else {
        _.eachObj(this.target, (v, attr) => {
          this._removeListen(attr);
        });
      }
    } else if (arguments.length == 1) {
      if (typeof attrs === 'function') {
        if (this.isArray) {
          for (let i = 0, l = this.target.length; i < l; i++) {
            this._removeListen(i + '', attrs);
          }
          this._removeListen('length', attrs);
        } else {
          _.eachObj(this.target, (v, attr) => {
            this._removeListen(attr, attrs);
          });
        }
      } else if (attrs instanceof Array) {
        for (let i = 0, l = attrs.length; i < l; i++) {
          this._removeListen(attrs[i] + '');
        }
      } else if (attrs && typeof attrs === 'object') {
        _.eachObj(attrs, (h, attr) => {
          this._removeListen(attr, h);
        });
      } else {
        this._removeListen(attrs + '');
      }
    } else if (arguments.length >= 2) {
      let i, l,
        _attrs = [],
        _handler = undefined;

      for (i = 0, l = arguments.length; i < l; i++) {
        if (typeof arguments[i] === 'function') {
          _handler = arguments[i];
          break;
        }
        if (arguments[i] instanceof Array) {
          _attrs.push.apply(_attrs, arguments[i]);
        } else {
          _attrs.push(arguments[i]);
        }
      }
      for (i = 0, l = _attrs.length; i < l; i++) {
        this._removeListen(_attrs[i] + '', _handler);
      }
    } else {
      throw TypeError('Invalid Parameter', arguments);
    }
    return this.target;
  }

  destroy() {
    _.eachObj(this.listens, (h, attr) => {
      this._removeListen(attr, h);
    });
    if (this.request_frame) {
      _.cancelAnimationFrame(this.request_frame);
      this.request_frame = undefined;
    }
    this.target = undefined;
    this.watchers = undefined;
    this.listens = undefined;
    this.changeRecords = undefined;
  }
}
module.exports = Observer;
