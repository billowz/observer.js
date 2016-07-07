window.observer = require('./core')
const utility = require('./utility'),
  {util} = utility,
  _proxy = require('./proxy')

util.assignIf(observer, utility, {
  eq(o1, o2){
    return _proxy.eq(o1, o2)
  },
  obj(o){
    return _proxy.obj(o)
  },
  onproxy(o){
    return _proxy.on(o)
  },
  unproxy(o){
    return _proxy.un(o)
  },
  proxy: _proxy,
  config: require('./configuration').get()
})
util.assignIf(observer.proxy, _proxy)
require('./es6proxy')
require('./es5defprop')

module.exports = observer
