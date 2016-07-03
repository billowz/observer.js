window.observer = require('./core')
const _ = require('./util'),
  proxy = require('./proxy')

_.assignIf(observer, {
  util: _,
  timeoutframe: require('./timeoutframe'),
  eq: proxy.eq,
  obj: proxy.obj,
  proxy: proxy
})
require('./es6proxy')
require('./es5defprop')
module.exports = observer
