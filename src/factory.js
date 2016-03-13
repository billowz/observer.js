const Observer = require('./core'),
  Map = require('./map'),
  {proxy} = require('./proxyEvent');

let observers = new Map();
let factory = {

  _bind(obj, observer) {
    observers.set(obj, observer);
  },

  _unbind(obj, observer) {
    if (observers.get(obj) === observer) {
      observers['delete'](obj);
    }
  },

  _get(obj) {
    return observers.get(obj);
  },

  hasListen(obj, attr, handler) {
    let observer,
      l = arguments.length;

    obj = proxy.obj(obj);
    observer = observers.get(obj);
    if (!observer) {
      return false;
    } else if (l == 1) {
      return true;
    } else if (l == 2) {
      return observer.hasListen(obj, attr);
    }
    return observer.hasListen(obj, attr, handler);
  },

  on(obj, attr, handler) {
    let observer;

    obj = proxy.obj(obj);
    observer = observers.get(obj);
    if (!observer) {
      observer = new Observer(obj);
      factory._bind(obj, observer);
    }
    obj = observer.on(attr, handler);
    if (!observer.hasListen()) {
      factory._unbind(obj, observer);
      observer.destroy();
    }
    return obj;
  },

  un(obj, attr, handler) {
    let observer;

    obj = proxy.obj(obj);
    observer = observers.get(obj);
    if (observer) {
      obj = arguments.length > 2 ? observer.un(attr, handler) : observer.un(attr);
      if (!observer.hasListen()) {
        factory._unbind(obj, observer);
        observer.destroy();
      }
    }
    return obj;
  }
}
module.exports = factory;
