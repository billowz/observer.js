import _ from 'utility'
import core from './core'
import proxy from './proxy'
import configuration from './configuration'
import './es6proxy'
import './es5defprop'

function hookArrayFunc(func, obj, callback, scope, own) {
  return func(obj, (v, k, s, o) => {
    return callback.call(this, proxy.proxy(v), k, s, o)
  }, scope, own)
}

let observer = _.assign({
  eq(o1, o2) {
    return proxy.eq(o1, o2)
  },
  obj(o) {
    return proxy.obj(o)
  },
  onproxy(o, h) {
    return proxy.on(o, h)
  },
  unproxy(o, h) {
    return proxy.un(o, h)
  },
  proxy: proxy,
  config: configuration.get(),

  $each(obj, callback, scope, own) {
    return hookArrayFunc(_.each, obj, callback, scope, own)
  },
  $map(obj, callback, scope, own) {
    return hookArrayFunc(_.map, obj, callback, scope, own)
  },
  $filter(obj, callback, scope, own) {
    return hookArrayFunc(_.filter, obj, callback, scope, own)
  },
  $aggregate(obj, callback, defVal, scope, own) {
    let rs = defVal
    each(obj, function(v, k, s, o) {
      rs = callback.call(this, rs, proxy.proxy(v), k, s, o)
    }, scope, own)
    return rs
  },
  $keys(obj, filter, scope, own) {
    let keys = []
    each(obj, function(v, k, s, o) {
      if (!filter || filter.call(this, proxy.proxy(v), k, s, o))
        keys.push(k)
    }, scope, own)
    return keys
  },
  $values(obj, filter, scope, own) {
    let values = []
    each(obj, function(v, k, s, o) {
      if (!filter || filter.call(this, proxy.proxy(v), k, s, o))
        values.push(v)
    }, scope, own)
    return values
  }
}, core)

export default _.assignIf(_.create(observer), {
  observer: observer,
  utility: _
}, _)
