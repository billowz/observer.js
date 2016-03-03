export default {

  hasProp(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  },

  eachObj(obj, callback) {
    for (let i in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, i)) {
        if (callback(obj[i], i) === false)
          return false;
      }
    }
  }
}
