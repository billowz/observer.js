window.observer = require('./core')
const utility = require('./utility'),
  {util} = utility,
  proxy = require('./proxy')

util.assignIf(observer, utility, {
  eq: proxy.eq,
  obj: proxy.obj,
  proxy: proxy
})
require('./es6proxy')
require('./es5defprop')

module.exports = observer
