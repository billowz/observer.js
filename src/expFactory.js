import Exp from './exp'
import observer from './factory'
import Map from './map'
import proxy from './proxyEvent'
import _ from './util'

class ExpressionFactory {
  constructor() {
    this.exps = new Map();
  }

  _bind(exp) {
    let obj = proxy.obj(exp.target),
      map = this.exps.get(obj);

    if (!map) {
      map = {};
      this.exps.set(obj, map)
    }
    map[exp.expression] = exp;
  }

  _unbind(exp) {
    let obj = proxy.obj(exp.target),
      map = this.exps.get(obj);

    if (map && map[exp.expression] === exp) {
      delete map[exp.expression];

      for (let key in map) {
        if (_.hasProp(map, key))
          return;
      }
      this.exps.delete(obj);
    }
  }

  _get(obj, exp) {
    let map;

    obj = proxy.obj(exp.target);
    map = this.exps.get(obj);
    if (map)
      return map[exp];
    return undefined;
  }

  _on(obj, exp, handler) {
    let path = Exp.toPath(exp);

    if (path.length > 1) {
      let exp = this._get(obj, exp);

      if (!exp) {
        exp = new Exp(obj, exp, path);
        this._bind(exp);
      }
      exp.addListen(handler);
      return exp.target;
    } else {
      return observer.on(obj, exp, handler);
    }
  }

  _un(obj, exp, handler) {
    let path = Exp.toPath(exp);

    if (path.length > 1) {
      let exp = this._get(obj, exp);

      if (exp) {
        exp.removeListen(handler);
      }
      if (!exp.hashListen()) {
        this._unbind(exp);
        return exp.destory();
      }
      return exp.target;
    } else {
      return observer.un(obj, exp, handler);
    }
  }

  hasListen(obj, exp, handler) {
    if (!exp || !Exp.toPath(exp).length) {
      return observer.hasListen.apply(observer, arguments);
    }
  }

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
          obj = this._on(obj, exp, h);
        });
      } else {
        throw TypeError('Invalid Parameter');
      }
    } else if (arguments.length >= 3) {
      let i,
        exps = [],
        handler = undefined;

      for (i = 1; i < arguments.length; i++) {
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
      console.log(exps, ', ', handler);
      for (i = 0; i < exps.length; i++) {
        obj = this._on(obj, exps[i] + '', handler);
      }
    }
    return obj;
  }


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
        for (let i = 0; i < p1.length; i++) {
          obj = this._on(obj, p1);
        }
      } else if (p1 && typeof p1 === 'object') {
        _.eachObj(p1, (h, exp) => {
          obj = this._un(obj, exp, h);
        });
      } else {
        obj = this._un(obj, p1 + '');
      }
    } else if (arguments.length >= 3) {
      let i;

      exps = [];
      handler = undefined;
      for (i = 1; i < arguments.length; i++) {
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
      for (i = 0; i < exps.length; i++) {
        obj = this._un(obj, exps[i] + '', handler);
      }
    }
    return obj;
  }
}
export default new ExpressionFactory();

