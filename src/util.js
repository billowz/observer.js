let lastTime,
  requestAnimationFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame,
  cancelAnimationFrame = window.cancelAnimationFrame ||
    window.webkitCancelAnimationFrame ||
    window.mozCancelAnimationFrame ||
    window.oCancelAnimationFrame ||
    window.msCancelAnimationFrame;

if (requestAnimationFrame) {
  requestAnimationFrame = requestAnimationFrame.bind(window);
} else {
  requestAnimationFrame = function requestTimeoutFrame(callback) {
    let currTime = new Date().getTime(),
      timeToCall = Math.max(0, 16 - (currTime - lastTime)),
      reqId = setTimeout(function() {
        callback(currTime + timeToCall);
      }, timeToCall);
    lastTime = currTime + timeToCall;
    return reqId;
  }
}
if (cancelAnimationFrame) {
  cancelAnimationFrame = cancelAnimationFrame.bind(window);
} else {
  cancelAnimationFrame = function cancelAnimationFrame(reqId) {
    clearTimeout(reqId);
  }
}
let util = {
  requestAnimationFrame: requestAnimationFrame,

  cancelAnimationFrame: cancelAnimationFrame,

  hasProp(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  },

  eachObj(obj, callback) {
    for (let i in obj) {
      if (obj.hasOwnProperty(i)) {
        if (callback(obj[i], i) === false)
          return false;
      }
    }
  },

  bind: Function.prototype.bind || function bind(scope) {
      if (arguments.length < 2 && (scope === undefined || scope === null)) {
        return this;
      }
      let fn = this,
        args = Array.prototype.slice.call(arguments, 1);
      return function() {
        return fn.apply(scope, args.concat(Array.prototype.slice.call(arguments)));
      };
  },


  indexOf: Array.prototype.indexOf || function indexOf(val) {
      for (let i = 0; i < this.length; i++) {
        if (this[i] === val) {
          return i;
        }
      }
      return -1;
  }

}

module.exports = util;
