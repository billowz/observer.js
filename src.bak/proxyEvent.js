const Map = require('./map'),
  _ = require('./util');

let proxyEvents = new Map();

function empty() {
}

function default_equal(obj1, obj2) {
  return obj1 === obj2;
}

function default_obj(obj) {
  return obj;
}

function default_proxy(obj) {
  return obj;
}

function bind(obj, handler) {
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
}

function unbind(obj, handler) {
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

export let proxy = {

}


export function proxyEnable() {
  proxy.on = bind;
  proxy.un = unbind;
  proxy.eq = undefined;
  proxy.obj = undefined;
  proxy.proxy = undefined;
}

export function proxyDisable() {
  proxy.on = empty;
  proxy.un = empty;
  proxy.eq = default_equal;
  proxy.obj = default_obj;
  proxy.proxy = default_proxy;
}

export function proxyChange(obj, proxy) {
  let handlers = proxyEvents.get(obj);
  if (handlers) {
    for (let i = handlers.length - 1; i >= 0; i--) {
      handlers[i](obj, proxy);
    }
  }
}
