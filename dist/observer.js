/*
 * observer.js v0.2.7 built in Thu, 28 Jul 2016 15:21:40 GMT
 * Copyright (c) 2016 Tao Zeng <tao.zeng.zt@gmail.com>
 * Released under the MIT license
 * support IE6+ and other browsers
 *https://github.com/tao-zeng/observer.js
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
  typeof define === 'function' && define.amd ? define('observer', factory) :
  (factory());
}(this, function () {

  var _ = require('utility');
  var observer = require('./core');
  var _proxy = require('./proxy');
  var configuration = require('./configuration');
  require('./es6proxy');
  require('./es5defprop');

  _.assignIf(observer, _, {
    eq: function (o1, o2) {
      return _proxy.eq(o1, o2);
    },
    obj: function (o) {
      return _proxy.obj(o);
    },
    onproxy: function (o, h) {
      return _proxy.on(o, h);
    },
    unproxy: function (o, h) {
      return _proxy.un(o, h);
    },

    proxy: _proxy,
    config: configuration.get()
  });

  module.exports = observer;

}));