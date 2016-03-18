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
    window.msCancelAnimationFrame,
  bind = Function.prototype.bind || function bind(scope) {
      if (arguments.length < 2 && (scope === undefined || scope === null)) {
        return this;
      }
      let fn = this,
        args = Array.prototype.slice.call(arguments, 1);
      return function() {
        return fn.apply(scope, args.concat(Array.prototype.slice.call(arguments)));
      };
    };

function requestTimeoutFrame(callback) {
  let currTime = new Date().getTime(),
    timeToCall = Math.max(0, 16 - (currTime - lastTime)),
    reqId = setTimeout(function() {
      callback(currTime + timeToCall);
    }, timeToCall);
  lastTime = currTime + timeToCall;
  return reqId;
}

function cancelTimeoutFrame(reqId) {
  clearTimeout(reqId);
}

if (requestAnimationFrame && cancelAnimationFrame) {
  requestAnimationFrame = bind.call(requestAnimationFrame, window);
  cancelAnimationFrame = bind.call(cancelAnimationFrame, window);
} else {
  requestAnimationFrame = requestTimeoutFrame
  cancelAnimationFrame = cancelTimeoutFrame
}

const propNameReg = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g,
  escapeCharReg = /\\(\\)?/g;

let exprCache = {};

function parseExpr(exp) {
  if (exp instanceof Array) {
    return exp;
  } else {
    let result = exprCache[exp];
    if (!result) {
      result = exprCache[exp] = [];
      (exp + '').replace(propNameReg, function(match, number, quote, string) {
        result.push(quote ? string.replace(escapeCharReg, '$1') : (number || match));
      });
    }
    return result;
  }
}

let util = {
  requestTimeoutFrame: requestTimeoutFrame,

  cancelTimeoutFrame: cancelTimeoutFrame,

  requestAnimationFrame: requestAnimationFrame,

  cancelAnimationFrame: cancelAnimationFrame,

  bind: bind,

  indexOf: Array.prototype.indexOf || function indexOf(val) {
      for (let i = 0, l = this.length; i < l; i++) {
        if (this[i] === val) {
          return i;
        }
      }
      return -1;
  },

  parseExpr: parseExpr,

  get(object, path, defaultValue) {
    if (object) {
      path = parseExpr(path);
      var index = 0,
        l = path.length;

      while (object && index < l) {
        object = object[path[index++]];
      }
      return (index == l) ? object : defaultValue;
    }
    return defaultValue;
  }
}

module.exports = util;
