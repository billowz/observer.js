if (!Object.getOwnPropertyDescriptor) {
  Object.getOwnPropertyDescriptor = function getOwnPropertyDescriptor(object, property) {
    if ((typeof object !== 'object' && typeof object !== 'function') || object === null) {
      throw new TypeError(ERR_NON_OBJECT + object);
    }
    return undefined;
  }
}

module.exports = {
  getOwnPropertyDescriptor: Object.getOwnPropertyDescriptor
}
