const _ = require('lodash');
let shims = {},
  protoShims = {};
if (!Function.prototype.bind) {
  protoShims.bind = function bind(scope) {
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
_.assign(Function.prototype, protoShims);
module.exports = _.assign(shims, protoShims);
