import Observer from './core'
import Map from './map'
import proxy from './proxyEvent'


class ObserverFactory {
  constructor() {
    this.observers = new Map();
  }

  _bind(observer) {
    this.observers.set(observer.target, observer);
  }

  _unbind(observer) {
    if (this.observers.get(observer.target) === observer) {
      this.observers.delete(observer.target);
    }
  }

  _get(target) {
    return this.observers.get(target);
  }

  hasListen(obj) {
    let target = proxy.obj(obj),
      observer = this._get(target);

    if (!observer) {
      return false;
    } else if (arguments.length == 1) {
      return true;
    } else {
      return observer.hasListen.apply(observer, Array.prototype.slice.call(arguments, 1));
    }
  }

  on(obj) {
    let target = proxy.obj(obj),
      observer = this._get(target);

    if (!observer) {
      observer = new Observer(target);
      this._bind(observer);
    }
    target = observer.on.apply(observer, Array.prototype.slice.call(arguments, 1));
    if (!observer.hasListen()) {
      this._unbind(observer);
      observer.destroy();
    }
    return target;
  }

  un(obj) {
    let target = proxy.obj(obj),
      observer = this._get(target);

    if (observer) {
      target = observer.un.apply(observer, Array.prototype.slice.call(arguments, 1));
      if (!observer.hasListen()) {
        this._unbind(observer);
        observer.destroy();
      }
    }
    return target;
  }
}
export default new ObserverFactory();
