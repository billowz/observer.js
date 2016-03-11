const Exp = require('./exp'),
  observer = require('./factory'),
  Map = require('./map'),
  {proxy} = require('./proxyEvent'),
  _ = require('./util');

let exps = new Map();
let factory = {
  _bind(exp) {
    let obj = proxy.obj(exp.target),
      map = exps.get(obj);

    if (!map) {
      map = {};
      exps.set(obj, map)
    }
    map[exp.expression] = exp;
  },

  _unbind(exp) {
    let obj = proxy.obj(exp.target),
      map = exps.get(obj);

    if (map && map[exp.expression] === exp) {
      delete map[exp.expression];

      for (let key in map) {
        if (map.hasOwnProperty(key))
          return;
      }
      exps['delete'](obj);
    }
  },

  _get(obj, exp) {
    let map;

    obj = proxy.obj(obj);
    map = exps.get(obj);
    if (map)
      return map[exp];
    return undefined;
  },

  _on(obj, exp, handler) {
    let path = Exp.toPath(exp);

    if (path.length > 1) {
      let _exp = factory._get(obj, exp);

      if (!_exp) {
        _exp = new Exp(obj, exp, path);
        factory._bind(_exp);
      }
      _exp.addListen(handler);
      return _exp.target;
    } else {
      return observer.on(obj, exp, handler);
    }
  },

  _un(obj, exp, handler) {
    let path = Exp.toPath(exp);

    if (path.length > 1) {
      let _exp = factory._get(obj, exp);

      if (_exp) {
        if (arguments.length > 2) {
          _exp.removeListen(handler);
        } else {
          _exp.removeListen();
        }
        if (!_exp.hasListen()) {
          factory._unbind(_exp);
          return _exp.destory();
        }
        return _exp.target;
      } else {
        let ob = observer._get(obj);

        return ob ? ob.target : proxy.obj(obj);
      }
    } else {
      return observer.un(obj, exp, handler);
    }
  },

  hasListen(obj, exp, handler) {
    if (!exp || typeof exp === 'function' || !Exp.toPath(exp).length) {
      return observer.hasListen.apply(observer, arguments);
    } else {
      let _exp = factory._get(obj, exp);
      if (_exp) {
        if (arguments.length == 2) {
          return true;
        }
        return _exp.hasListen(handler);
      }
      return false;
    }
  },

  on(obj) {
    if (arguments.length < 2) {
      throw TypeError('Invalid Parameter');
    } else if (arguments.length === 2) {
      let p1 = arguments[1];
      if (typeof p1 === 'function') {
        return observer.on(obj, p1);
      } else if (p1 && typeof p1 === 'object') {
        _.eachObj(p1, (h, exp) => {
          if (typeof h !== 'function') {
            throw TypeError('Invalid Observer Handler');
          }
          obj = factory._on(obj, exp, h);
        });
      } else {
        throw TypeError('Invalid Parameter');
      }
    } else if (arguments.length >= 3) {
      let i, l,
        exps = [],
        handler = undefined;

      for (i = 1, l = arguments.length; i < l; i++) {
        if (typeof arguments[i] === 'function') {
          handler = arguments[i];
          break;
        }
        if (arguments[i] instanceof Array) {
          exps.push.apply(exps, arguments[i]);
        } else {
          exps.push(arguments[i]);
        }
      }
      if (!handler) {
        throw TypeError("Invalid Observer Handler", handler);
      }
      for (i = 0, l = exps.length; i < l; i++) {
        obj = factory._on(obj, exps[i] + '', handler);
      }
    }
    return obj;
  },


  un(obj) {
    if (arguments.length < 1) {
      throw TypeError('Invalid Parameter');
    } else if (arguments.length === 1) {
      return observer.un(obj);
    } else if (arguments.length === 2) {
      let p1 = arguments[1];
      if (typeof p1 === 'function') {
        obj = observer.un(obj, p1);
      } else if (p1 instanceof Array) {
        for (let i = 0, l = p1.length; i < l; i++) {
          obj = factory._on(obj, p1);
        }
      } else if (p1 && typeof p1 === 'object') {
        _.eachObj(p1, (h, exp) => {
          obj = factory._un(obj, exp, h);
        });
      } else {
        obj = factory._un(obj, p1 + '');
      }
    } else if (arguments.length >= 3) {
      let i, l,
        exps = [],
        handler = undefined;

      for (i = 1, l = arguments.length; i < l; i++) {
        if (typeof arguments[i] === 'function') {
          handler = arguments[i];
          break;
        }
        if (arguments[i] instanceof Array) {
          exps.push.apply(exps, arguments[i]);
        } else {
          exps.push(arguments[i]);
        }
      }
      for (i = 0, l = exps.length; i < l; i++) {
        obj = factory._un(obj, exps[i] + '', handler);
      }
    }
    return obj;
  }
};
module.exports = factory;

