const tf = require('./timeoutframe')

window.requestAnimationFrame = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  tf.request

window.cancelAnimationFrame = window.cancelAnimationFrame ||
  window.webkitCancelAnimationFrame ||
  window.mozCancelAnimationFrame ||
  window.oCancelAnimationFrame ||
  window.msCancelAnimationFrame ||
  tf.cancel

function fixProto(Type, prop, val) {
  if (!Type.prototype[prop])
    Type.prototype[prop] = val
}

fixProto(Function, 'bind', function bind(scope) {
  let fn = this,
    args = Array.prototype.slice.call(arguments, 1)

  return function() {
    return fn.apply(scope, args.concat(Array.prototype.slice.call(arguments)))
  }
})
