const _ = require('lodash'),
  observer = require('./observer'),
  rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;

function baseToString(val) {
  return (val === undefined || val === null) ? '' : (val + '');
}

function toPath(value) {
  if (_.isArray(value)) {
    return value.map(val => {
      return val + '';
    });
  }
  var result = [];
  baseToString(value).replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
}

class Watcher {
  constructor(target, expression, handler) {
    this.target = target;
    this.expression = expression;
    this.handler = handler;
    this.path = toPath(expression);
    this.observers = [];
    this._watchItem(this.target, 0);
  }
  _watchItem(obj, idx) {
    if (idx >= this.path.length) {
      return;
    }
    let attr = this.path[idx];
    if (_.isPlainObject(obj) || _.isArray(obj)) {
      console.log('_watchItem ', _.slice(this.path, 0, idx + 1));
      this._observe(obj, attr, idx);
      this._watchItem(obj[attr], idx + 1);
    }
  }
  canObserve(obj) {
    return _.isPlainObject(obj) || _.isArray(obj);
  }
  _observe(obj, attr, idx) {
    let handler = (attr, val, oldVal) => {
      console.log('handler ', _.slice(this.path, 0, idx + 1));
      if (idx < this.path.length - 1) {
        if (this.canObserve(oldVal)) {
          this._unobserve(oldVal, idx + 1);
        }
        if (this.canObserve(val)) {
          this._observe(val, idx + 1);
        }
        let path = _.slice(idx);
        oldVal = _.get(oldVal, path);
        val = _.get(val, path);
      }
      this.handler(this.expression, val, oldVal, this.target);
    }
    console.log('observe ', _.slice(this.path, 0, idx + 1));
    observer.observe(obj, attr, handler);
  }
  _unobserve(obj, idx) {}


}
Watcher.observer = observer;
module.exports = Watcher;
