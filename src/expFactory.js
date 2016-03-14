const Exp = require('./exp'),
  observer = require('./factory'),
  Map = require('./map'),
  {proxy} = require('./proxyEvent'),
  _ = require('./util');

let exps = new Map();
let factory = {
  _bind(obj, exp) {
    let map = exps.get(obj);

    if (!map) {
      exps.set(obj, (map = {}));
    }
    map[exp.expression] = exp;
  },

  _unbind(obj, exp) {
    let map = exps.get(obj);

    if (map && map[exp.expression] == exp) {
      delete map[exp.expression];

      for (let key in map) {
        return;
      }
      exps['delete'](obj);
    }
  },

  _get(obj, expression) {
    let map = exps.get(obj);

    return map ? map[expression] : undefined;
  },

  on(obj, expression, handler) {
    let path = Exp._parseExpr(expression);

    if (path.length > 1) {
      let exp;

      obj = proxy.obj(obj);
      exp = factory._get(obj, expression);
      if (!exp) {
        exp = new Exp(obj, expression, path);
        factory._bind(obj, exp);
      }
      exp.on(handler);
      return exp.target;
    } else {
      return observer.on(obj, expression, handler);
    }
  },

  un(obj, expression, handler) {
    let path = Exp._parseExpr(expression);

    if (path.length > 1) {
      let exp;

      obj = proxy.obj(obj);
      exp = factory._get(obj, expression);
      if (exp) {
        if (arguments.length > 2)
          exp.un(handler);
        else
          exp.un();

        if (!exp.hasListen()) {
          factory._unbind(obj, exp);
          return exp.destory();
        }
        return exp.target;
      } else {
        let ob = observer._get(obj);

        return ob ? ob.target : obj;
      }
    } else {
      return observer.un(obj, expression, handler);
    }
  },

  hasListen(obj, expression, handler) {
    let l = arguments.length;
    if (l == 1) {
      return observer.hasListen(obj);
    } else if (l == 2) {
      if (typeof expression == 'function') {
        return observer.hasListen(obj, expression);
      }
    }
    let path = Exp._parseExpr(expression);
    if (path.length > 1) {
      let exp = factory._get(proxy.obj(obj), expression);
      if (exp)
        return l == 2 ? true : exp.hasListen(handler);
      return false;
    } else if (l == 2) {
      return observer.hasListen(obj, expression);
    } else {
      return observer.hasListen(obj, expression, handler);
    }
  }
};
module.exports = factory;

