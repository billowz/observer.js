const Map = require('./map'),
  _ = require('./util');

let proxyEvents = new Map();

export let proxy = {
  eq(obj1, obj2) {
    return obj1 === obj2;
  },

  obj(obj) {
    return obj;
  },

  proxy(obj) {
    return obj;
  },

  on() {},

  un() {},

  _on(obj, handler) {
    let handlers;

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

  _un(obj, handler) {
    let handlers;

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

export function proxyEnable() {
  proxy.on = proxy._on;
  proxy.un = proxy._un;
}

export function proxyChange(obj, proxy) {
  handlers = proxyEvents.get(obj);
  if (handlers) {
    for (let i = handlers.length - 1; i >= 0; i--) {
      handlers[i](obj, proxy);
    }
  }
}
