import _ from 'utility'
import core from './core'
import _proxy from './proxy'
import configuration from './configuration'
import './es6proxy'
import './es5defprop'

export default _.assignIf(core, _, {
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
