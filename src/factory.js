const Observer = require('./core'),
  Map = require('./map'),
  {proxy} = require('./proxyEvent');

let observers = new Map();
let factory = {
  _bind(observer) {
    observers.set(proxy.obj(observer.target), observer);
  },

  _unbind(observer) {
    let target = proxy.obj(observer.target);

    if (observers.get(target) === observer) {
      observers['delete'](target);
    }
  },

  _get(target) {
    return observers.get(proxy.obj(target));
  },

  hasListen(obj) {
    let observer = factory._get(obj);

    if (!observer) {
      return false;
    } else if (arguments.length == 1) {
      return true;
    } else {
      return observer.hasListen.apply(observer, Array.prototype.slice.call(arguments, 1));
    }
  },

  on(obj) {
    let observer;

    obj = proxy.obj(obj);
    observer = factory._get(obj);
    if (!observer) {
      observer = new Observer(obj);
      factory._bind(observer);
    }
    obj = observer.on.apply(observer, Array.prototype.slice.call(arguments, 1));
    if (!observer.hasListen()) {
      factory._unbind(observer);
      observer.destroy();
    }
    return obj;
  },

  un(obj) {
    let observer;

    obj = proxy.obj(obj);
    observer = factory._get(obj);
    if (observer) {
      obj = observer.un.apply(observer, Array.prototype.slice.call(arguments, 1));
      if (!observer.hasListen()) {
        factory._unbind(observer);
        observer.destroy();
      }
    }
    return obj;
  }
}
module.exports = factory;
