const _ = require('lodash');
let _observers = new Map();

function bindObserver(target, observer) {
  _observers.set(target, observer);
}

function getBindObserver(target) {
  return _observers.get(target);
}

class Observer {
  constructor(target) {
    if(!_.isArray(target) || !_.isObject(target))
    bindObserver(target, this);

  }
}

module.exports = Observer;
