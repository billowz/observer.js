const _ = require('lodash'),
  ARRAY_METHODS = ['push', 'pop', 'shift', 'unshift', 'sort', 'reverse', 'splice'];
let _observers = new Map();

function bindObserver(observer) {
  if (observer._binded !== true) {
    _observers.set(observer.target, observer);
    observer._binded = true;
  }
}

function unbindObserver(observer) {
  if (observer._binded === true) {
    _observers.delete(observer.target, observer);
    observer._binded = false;
  }
}

function getBindObserver(target) {
  return _observers.get(target);
}

function isBind(observer) {
  return observer._binded;
}

class Observer {
  constructor(target, history) {
    if (!_.isArray(target) || !_.isObject(target)) {
      throw TypeError('can not observe object[' + (typeof target) + ']');
    }
    this.target = target;
    this.listens = [];
    this.attrListens = {};
    this.watchers = {};
    this.history = _.isNumber(history) ? history : 0;
    bindObserver(this);
  }
  static attrArg(attr) {
    if (_.isUndefined(attr) || _.isNull(attr)) {
      attr = _.keys(this.target);
    } else if (!_.isArray(attr)) {
      attr = [attr];
    }
    return attr;
  }
  static handlerArg(handler) {
    if (!_.isArray(handler)) {
      handler = [handler];
    }
    handler = _.filter(hander, (h) => {
      return _.isFunction(h);
    });
    return handler;
  }
  _onChanged(attr, state, oldVal) {
    _.each(state.handlers, (handler) => {
      handler(attr, state.value, oldValue, this.target, state.history);
    });
  }
  _watch(attr, handler) {
    handler = Observer.handlerArg(handler);
    if (handler.length == 0) {
      return;
    }
    let state = this.watchers[attr];
    if (state) {
      _.each(handler, (h) => {
        if (!_.include(state.handlers, h)) {
          state.handlers.push(h);
        }
      });
      return;
    }

    state = this.watchers[attr] = {
      value: this.target[attr],
      history: [],
      handlers: handler
    };
    state.value = this.target[attr];
    Object.defineProperty(this.target, attr, {
      get() {
        return state.value;
      },
      set: (value) => {
        let oldValue = state.value;
        if (value !== oldValue) {
          state.value = value;
          if (this.history > 0) {
            state.history.splice(0, 0, oldValue);
            if (state.history.length > this.history) {
              state.history.splice(this.history, state.history.length - this.history);
            }
          }
          this._onChanged(attr, state, oldValue);
        }
      }
    })
  }
  _unwatch(attr, handler) {
    let state = this.watchers[attr];
    if (state) {
      handler = Observer.handlerArg(handler);
      if (handler.length == 0) {
        // unwatch all
      } else {

      }
    }
  }
  getHistory(attr) {
    let state = this.watchers[attr];
    return state ? state.history : [];
  }
  on(attr, handler) {
    if (_.isFunction(attr)) {
      handler = attr;
      attr = undefined;
    }
    attr = Observer.attrArg(attr);
    if (attr.length = 0) {
      return;
    }

  }
  un(attr, handler) {}
  destory() {
    _.map(this.watchers, (state, attr) => {
      this._unwatch(attr);
    });
    this.watchers = {};
    unbindObserver(this);
  }
}

module.exports = Observer;
