const {proxy} = require('./proxyEvent'),
  Exp = require('./exp'),
  exp = require('./expFactory');

window.observer = {
  on: exp.on,
  un: exp.un,
  hasListen: exp.hasListen,
  obj: proxy.obj,
  eq: proxy.eq,
  proxy: proxy,
  util: require('./util'),
  Map: require('./map'),
  VBProxyFactory: require('./core').VBProxyFactory
}
module.exports = window.observer;
