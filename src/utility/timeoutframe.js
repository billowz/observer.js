let lastTime;

export function request(callback) {
  let currTime = new Date().getTime(),
    timeToCall = Math.max(0, 16 - (currTime - lastTime)),
    reqId = setTimeout(function() {
      callback(currTime + timeToCall);
    }, timeToCall);
  lastTime = currTime + timeToCall;
  return reqId;
}

export function cancel(reqId) {
  clearTimeout(reqId);
}
