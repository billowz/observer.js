if (!Function.prototype.bind) {
  Function.prototype.bind = function bind(scope) {
    if (arguments.length < 2 && scope === undefined) {
      return this
    }
    let fn = this,
      args = [], i;
    for (i = 1; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    return function() {
      let i,
        arg = args.concat([]);
      for (i = 0; i < arguments.length; i++) {
        arg.push(arguments[i]);
      }
      return fn.apply(scope, arg);
    }
  }
}
