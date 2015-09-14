
if (!window.requestAnimationFrame) {
  let lastTime = 0;
  window.requestAnimationFrame = window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function requestTimeoutFrame(callback) {
      let currTime = new Date().getTime(),
        timeToCall = Math.max(0, 16 - (currTime - lastTime)),
        reqId = setTimeout(function() {
          callback(currTime + timeToCall);
        }, timeToCall);
      lastTime = currTime + timeToCall;
      return reqId;
  }

  window.cancelAnimationFrame = window.webkitCancelAnimationFrame ||
    window.mozCancelAnimationFrame ||
    window.oCancelAnimationFrame ||
    window.msCancelAnimationFrame ||
    function cancelAnimationFrame(reqId) {
      clearTimeout(reqId);
  }
}
