const observer = require('./factory'),
  rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;

function baseToString(val) {
  return (val === undefined || val === null) ? '' : (val + '');
}

function toPath(value) {
  let result = [];
  if (typeof value === 'string') {
    baseToString(value).replace(rePropName, function(match, number, quote, string) {
      result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
    });
  }
  return result;
}

class Exp {
  constructor(target, exp, path) {
    if (!this.canObserve(target)) {
      throw new TypeError('Invalid Param');
    }
    this.exp = exp;
    this.handlers = [];
    this.path = path || toPath(exp);
    this.observers = [];
    this.observeHandlers = this._initObserveHandlers();
  }


  _observe(obj, idx) {
    let attr = this.path[idx];

    if (idx + 1 < this.path.length)
      obj[attr] = this._observe(obj[attr], idx + 1);
    return observer.observe(obj, attr, this.observeHandlers[idx]);
  }

  _unobserve(obj, idx) {
    let attr = this.path[idx];

    obj = observer.unobserve(obj, attr, this.observeHandlers[idx]);
    if (idx + 1 < this.path.length)
      obj[attr] = this._unobserve(obj[attr], idx + 1);
    return obj;
  }


  _initObserveHandlers() {
    return _.map(this.path, (val, idx) => {
      return this._createObserveHandler(idx);
    });
  }

  _createObserveHandler(idx) {
    let path = this.path.slice(0, idx + 1),
      rpath = this.path.slice(idx + 1),
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
