const Map = require('./map'),
  _ = require('./util');

let proxyEvents = new Map();

export let proxy = {

  isEnable() {
    return window.VBProxy;
  },

  eq(obj1, obj2) {
    if (window.VBProxy) {
      let desc1 = window.VBProxy.getVBProxyDesc(obj1),
        desc2 = window.VBProxy.getVBProxyDesc(obj2);
      if (desc1)
        obj1 = desc1.object;
      if (desc2)
        obj2 = desc2.object;
    }
    return obj1 === obj2;
  },

  obj(obj) {
    if (window.VBProxy) {
      let desc = window.VBProxy.getVBProxyDesc(obj);
      return desc ? desc.object : obj;
    }
    return obj;
  },

  on(obj, handler) {
    let handlers;

    if (!window.VBProxy) {
      return;
    }
    if (typeof handler !== 'function') {
      throw TypeError('Invalid Proxy Event Handler');
    }
    obj = proxy.obj(obj);
    handlers = proxyEvents.get(obj);
    if (!handlers) {
      handlers = [];
      proxyEvents.set(obj, handlers);
    }
    handlers.push(handler);
  },

  un(obj, handler) {
    let handlers;

    if (!window.VBProxy) {
      return;
    }
    obj = proxy.obj(obj);
    handlers = proxyEvents.get(obj);
    if (handlers) {
      if (arguments.length > 1) {
        if (typeof handler === 'function') {
          let idx = _.indexOf.call(handlers, handler);
          if (idx != -1) {
            handlers.splice(idx, 1);
          }
        }
      } else {
        proxyEvents['delete'](obj);
      }
    }
  }
}

export function proxyChange(obj, proxy) {
  handlers = proxyEvents.get(obj);
  if (handlers) {
    for (let i = handlers.length - 1; i >= 0; i--) {
      handlers[i](obj, proxy);
    }
  }
}
