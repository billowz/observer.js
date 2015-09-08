let _ = require('lodash');
if (!Function.prototype.bind) {
  Function.prototype.bind = function bind(scope) {
    if (arguments.length < 2 && scope === undefined) {
      return this
    }
    let fn = this,
      args = _.slice(arguments, 1);
    return function() {
      return fn.apply(scope, args.push.apply(args, arguments));
    }
  }
}
module.exports = {
  bind: Function.prototype.bind
}
