const {proxy} = require('./proxyEvent'),
  Exp = require('./exp'),
  exp = require('./expFactory'),
  Observer = require('./core');

window.observer = {
  on: exp.on,
  un: exp.un,
  hasListen: exp.hasListen,
  obj: proxy.obj,
  eq: proxy.eq,
  proxy: proxy,
  util: require('./util'),
  Map: require('./map'),
  VBProxyFactory: Observer.VBProxyFactory,
  setLazy(lazy) {
    Observer.lazy = lazy;
  }
}
module.exports = window.observer;
