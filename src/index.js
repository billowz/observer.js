const {proxy} = require('./proxyEvent'),
  Exp = require('./exp'),
  exp = require('./expFactory'),
  Observer = require('./core');

window.observer = {
  on: exp.on,
  un: exp.un,
  hasListen: exp.hasListen,
  obj(obj) {
    return proxy.obj(obj);
  },
  eq(obj1, obj2) {
    return proxy.eq(obj1, obj2)
  },
  proxy: proxy,
  util: require('./util'),
  Map: require('./map'),
  VBProxyFactory: Observer.VBProxyFactory,
  setConfig: Observer.setConfig,
  config() {
    return Observer.config;
  },
  policy() {
    return Observer.policy;
  }
}
module.exports = window.observer;
