const proxy = require('./proxyEvent'),
  Exp = require('./exp'),
  exp = require('./expFactory'),
  OBJECT = require('./defineProperty');
window.observer = {
  on: exp.on,
  un: exp.un,
  hasListen: exp.hasListen,
  obj: proxy.obj,
  eq: proxy.eq,
  getVal: Exp.get,
  defineProperty: OBJECT.defineProperty,
  defineProperties: OBJECT.defineProperties,
  getOwnPropertyDescriptor: OBJECT.getOwnPropertyDescriptor
}
module.exports = window.observer;
