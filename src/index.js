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
  getVal: Exp.get
}
module.exports = window.observer;
