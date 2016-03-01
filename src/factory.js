import Observer from './core'

class ObserverFactory {
  constructor() {
    this.observers = new Map();
  }

  _bind(observer) {
    if (observer.__factory_binded !== true) {
      this.observers.set(observer.target, observer);
      observer.__factory_binded = true;
    }
  }

  _unbind(observer) {
    if (observer.__factory_binded === true) {
      if (this.observers.get(observer.target) === observer) {
        this.observers.delete(observer.target);
      }
      observer.__factory_binded = false;
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
      observer.destory();
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
        observer.destory();
      }
    }
    return target;
  }
}

ObserverFactory.obj = Observer.obj;
ObserverFactory.eq = Observer.eq;

export default new ObserverFactory();
