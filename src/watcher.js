const _ = require('./util'),
  observer = require('./observer'),
  rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;

let _watchers = new Map();


function baseToString(val) {
  return (val === undefined || val === null) ? '' : (val + '');
}

function toPath(value) {
  if (!_.isString(value)) {
    return [];
  }
  var result = [];
  baseToString(value).replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
}

class Watcher {
  constructor(target, expression, path) {
    if (!this.canObserve(target)) {
      throw new TypeError('Invalid Param');
    }
    this.expression = expression;
    this.handlers = [];
    this.path = path || toPath(expression);
    this.observers = [];
    this._observeHandlers = this._initObserveHandlers();
    this.target = this._observe(target, 0);
    _watchers[this.expression] = this;
  }

  addListen(handler) {
    if (_.isArray(handler)) {
      _.each(handler, h => {
        if (_.isFunction(h) && !_.include(this.handlers, h)) {
          this.handlers.push(h);
        }
      });
    } else if (_.isFunction(handler) && !_.include(this.handlers, handler)) {
      this.handlers.push(handler);
    }
  }

  removeListen(handler) {
    if (_.isArray(handler)) {
      _.remove(this.handlers, (h) => {
        return _.include(handler, h);
      });
    } else if (_.isFunction(handler)) {
      _.remove(this.handlers, handler);
    } else if (arguments.length == 0) {
      this.handlers = [];
    }
  }

  hasListen() {
    return !!this.handlers.length;
  }

  canObserve(obj) {
    return obj && _.isObject(obj);
  }

  destory() {
    this.target = this._unobserve(this.target, 0);
  }

  _observe(obj, idx) {
    if (idx < this.path.length && this.canObserve(obj)) {
      let attr = this.path[idx];
      obj[attr] = this._observe(obj[attr], idx + 1);
      return observer.observe(obj, attr, this._observeHandlers[idx]);
    }
    return obj;
  }

  _unobserve(obj, idx) {
    if (idx < this.path.length && this.canObserve(obj)) {
      let attr = this.path[idx], ret;
      ret = observer.unobserve(obj, attr, this._observeHandlers[idx]);
      ret[attr] = this._unobserve(obj[attr], idx + 1);
      return ret;
    }
    return obj;
  }

  _initObserveHandlers() {
    return _.map(this.path, (val, idx) => {
      return this._createObserveHandler(idx)
    });
  }

  _createObserveHandler(idx) {
    let path = _.slice(this.path, 0, idx + 1),
      rpath = _.slice(this.path, idx + 1),
      ridx = this.path.length - idx - 1;
    return (attr, val, oldVal) => {
      if (ridx > 0) {
        this._unobserve(oldVal, idx + 1);
        this._observe(val, idx + 1);
        oldVal = _.get(oldVal, rpath);
        val = _.get(val, rpath);
      }
      if (val !== oldVal && this.handlers) {
        _.each(this.handlers, (h) => {
          h(this.expression, val, oldVal, this.target);
        })
      }
    }
  }
}


let watcherLookup = new Map();

function addWatcher(watcher) {
  let obj = _.checkObj(watcher.target),
    map = watcherLookup.get(obj);
  if (!map) {
    map = {};
    watcherLookup.set(obj, map)
  }
  map[watcher.expression] = watcher;
}

function getWatcher(obj, expression) {
  obj = _.checkObj(obj);
  let map = watcherLookup.get(obj);
  if (map) {
    return map[expression];
  }
  return undefined;
}

function removeWatcher(watcher) {
  let obj = _.checkObj(watcher.target),
    map = watcherLookup.get(obj);
  if (map) {
    delete map[watcher.expression];
    if (!_.findKey(map)) {
      watcherLookup.delete(obj);
    }
  }
}

function doObserve(object, expression, handler, cascade, nonPath, signPath, multipath) {
  if (expression && _.isArray(expression)) {
    if (!expression.length) {
      expression = undefined;
    } else {
      let ret = object;
      _.each(expression, exp => {
        ret = cascade(object, exp, handler);
      });
      return ret;
    }
  }
  let path = toPath(expression);
  if (!path.length) {
    return nonPath(object, handler);
  } else if (path.length == 1) {
    return signPath(object, expression, handler);
  } else {
    return multipath(object, expression, handler, path);
  }
}
function observe(object, expression, handler) {
  if (arguments.length == 2) {
    handler = expression;
    expression = undefined;
  }
  let args = arguments;
  return doObserve(object, expression, handler, observe, observer.observe, observer.observe, (object, expression, handler, path) => {
    let watcher = getWatcher(object, expression) || new Watcher(object, expression, path);
    watcher.addListen.apply(watcher, _.slice(args, 2));
    if (!watcher.hasListen()) {
      removeWatcher(watcher);
      watcher.destory();
      return object;
    }
    return watcher.target;
  });
}
function unobserve(object, expression, handler) {
  if (arguments.length == 2) {
    handler = expression;
    expression = undefined;
  }
  let args = arguments;
  return doObserve(object, expression, handler, unobserve, observer.unobserve, observer.unobserve, (object, expression, handler, path) => {
    let watcher = getWatcher(object, expression);
    if (watcher) {
      watcher.removeListen.apply(watcher, _.slice(args, 2));
      if (!watcher.hasListen()) {
        removeWatcher(watcher);
        watcher.destory();
      }
      return watcher.target;
    }
    return object;
  });
}

module.exports = {
  observe: observe,
  unobserve: unobserve
};
