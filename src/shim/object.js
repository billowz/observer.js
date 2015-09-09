function doesDefinePropertyWork(object) {
  try {
    let val;
    Object.defineProperty(object, 'sentinel', {
      get() {
        return val;
      },
      set(value) {
        val = value;
      }
    });
    object.sentinel = 1;
    return object.sentinel === val;
  } catch (exception) {
    return false;
  }
}
let supportDefinePropertyOnObject = Object.defineProperty && doesDefinePropertyWork({});
let supportDefinePropertyOnDom = Object.defineProperty && doesDefinePropertyWork(document.createElement('div'));
if (!supportDefinePropertyOnObject) {

  function fixObject(name, fixedFn, domFn) {
    if (domFn) {
      Object[name] = function(object) {
        if (_.isElement(object)) {
          domFn.apply(Object, arguments);
        } else {
          fixedFn.apply(Object, arguments);
        }
      }
    } else {
      Object[name] = fixedFn;
    }
  }

  fixObject('defineProperty', function(object, prop, desc) {
    if ('value' in desc) {
      object[prop] = desc.value;
    } else if ('get' in desc || 'set' in desc) {
      if (desc.get) {
        if (Object.prototype.__defineGetter__) {
          Object.prototype.__defineGetter__.call(o, prop, desc.get);
        }
      }
      if (desc.set) {
        if (Object.prototype.__defineSetter__) {
          Object.prototype.__defineSetter__.call(o, prop, desc.set);
        }
      }
    }
  }, supportDefinePropertyOnDom ? Object.defineProperty : null);




  fixObject('defineProperties', function() {}, supportDefinePropertyOnDom ? Object.defineProperties : null);
  fixObject('getOwnPropertyDescriptor', function(object, attr) {
    console.log('getOwnPropertyDescriptor', arguments)
  }, supportDefinePropertyOnDom ? Object.getOwnPropertyDescriptor : null);
}

