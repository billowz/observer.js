import Observer from './core'

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

  on(obj) {
    let target = Observer.obj(obj),
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
    let target = Observer.obj(obj),
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

ObserverFactory.prototype.obj = Observer.obj;
ObserverFactory.prototype.eq = Observer.eq;

export default new ObserverFactory();
