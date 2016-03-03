import Map from './map'

class ProxyEventFactory {
  isEnable() {
    return window.VBProxy;
  }
  eq(obj, obj2) {
    return this.obj(obj) === this.obj(obj2);
  }
  obj(obj) {
    if (window.VBProxy && window.VBProxy.isVBProxy(obj))
      return window.VBProxy.getVBProxyDesc(obj).object;
    return obj;
  }

  constructor() {
    this.proxyEvents = new Map();
  }

  onProxy(obj, handler) {
    let handlers;

    if (!window.VBProxy) {
      return;
    }
    if (typeof handler !== 'function') {
      throw TypeError('Invalid Proxy Event Handler');
    }
    obj = this.obj(obj);
    handlers = this.proxyEvents.get(obj);
    if (!handlers) {
      handlers = [];
      this.proxyEvents.set(obj, handlers);
    }
    handlers.push(handler);
  }

  unProxy(obj, handler) {
    let handlers;

    if (!window.VBProxy) {
      return;
    }
    obj = this.obj(obj);
    handlers = this.proxyEvents.get(obj);
    if (handlers) {
      if (arguments.length > 1) {
        if (typeof handler === 'function') {
          let idx = handlers.indexOf(handler);
          if (idx != -1) {
            handlers.splice(idx, 1);
          }
        }
      } else {
        this.proxyEvents.delete(obj);
      }
    }
  }

  _fire(proxy) {
    if (window.VBProxy && window.VBProxy.isVBProxy(proxy)) {
      let obj = window.VBProxy.getVBProxyDesc(obj).object,
        handlers = this.proxyEvents.get(obj);

      if (handlers) {
        for (let i = 0; i < handlers.length; i++) {
          handlers[i](obj, proxy);
        }
      }
    }
  }
}
export default new ProxyEventFactory();
