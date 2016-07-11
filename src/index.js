const _ = require('utility'),
  observer = require('./core'),
  _proxy = require('./proxy'),
  configuration = require('./configuration')

require('./es6proxy')
require('./es5defprop')

_.assignIf(observer, _, {
  eq(o1, o2) {
    return _proxy.eq(o1, o2)
  },
  obj(o) {
    return _proxy.obj(o)
  },
  onproxy(o, h) {
    return _proxy.on(o, h)
  },
  unproxy(o, h) {
    return _proxy.un(o, h)
  },
  proxy: _proxy,
  config: configuration.get()
})

module.exports = observer
