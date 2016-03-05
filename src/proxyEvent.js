
const Map = require('./map');

class ProxyEventFactory {
  isEnable() {
    return window.VBProxy;
  }
  eq(obj, obj2) {
    return this.obj(obj) === this.obj(obj2);
  }
  obj(obj) {
    if (window.VBProxy && window.VBProxy.isVBProxy(obj)) {
      let desc = window.VBProxy.getVBProxyDesc(obj);
      return desc ? desc.object : undefined;
    }
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
          let idx = _.indexOf.call(handlers, handler);
          if (idx != -1) {
            handlers.splice(idx, 1);
          }
        }
      } else {
        this.proxyEvents['delete'](obj);
      }
    }
  }

  _fire(obj, proxy) {
    handlers = this.proxyEvents.get(obj);
    if (handlers) {
      for (let i = 0; i < handlers.length; i++) {
        handlers[i](obj, proxy);
      }
    }
  }
}
module.exports = new ProxyEventFactory();
