/**
 * 修复浏览器(IE 6,7,8)对Object.defineProperty的支持，使用VBProxy
 */

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

window.supportDefinePropertyOnObject = Object.defineProperty && doesDefinePropertyWork({}),
window.supportDefinePropertyOnDom = Object.defineProperty && doesDefinePropertyWork(document.createElement('div'));
if (!window.supportDefinePropertyOnObject) {
  let VBProxy = require('./VBProxy').init();
  window.supportDefinePropertyOnObject = VBProxy.isSupport();

  function isElement(value) {
    return value !== undefined
      && typeof HTMLElement !== 'undefined'
      && value instanceof HTMLElement
      && value.nodeType === 1
  }
  function fixObject(name, fixedFn, domFn) {
    if (domFn) {
      Object[name] = function(object) {
        if (isElement(object)) {
          return domFn.apply(Object, arguments);
        } else {
          return fixedFn.apply(Object, arguments);
        }
      }
    } else {
      Object[name] = fixedFn;
    }
  }

  function isAccessor(desc) {
    return 'get' in desc || 'set' in desc;
  }

  function buildProxy(proxy, object, appendProps) {
    let prop;
    for (var i = 0; appendProps && i < appendProps.length; i++) {
      prop = appendProps[i];
      if (!(prop in object)) {
        object[prop] = undefined;
      }
    }
    return VBProxy.createVBProxy(proxy || object);
  }

  fixObject('defineProperty', function(object, prop, desc) {
    var descs = {};
    descs[prop] = desc;
    return Object.defineProperties(object, descs);
  }, supportDefinePropertyOnDom ? Object.defineProperty : null);
  fixObject('defineProperties', function(object, descs) {
    let prop;
    if (VBProxy.isVBProxy(object)) {
      proxy = object;
      object = proxy.__proxy__.object;
    }
    for (prop in descs) {
      if (!(prop in object)) {
        object[prop] = undefined;
      }
    }
    proxy = VBProxy.createVBProxy(object);
    for (prop in descs) {
      proxy.__proxy__.defineProperty(prop, descs[prop]);
    }
    return proxy;
  }, supportDefinePropertyOnDom ? Object.defineProperties : null);
  fixObject('getOwnPropertyDescriptor', function(object, attr) {
    let proxy, define;
    if (VBProxy.isSupport()) {
      proxy = VBProxy.getVBProxy(object);
      if (proxy) {
        if (!(attr in proxy)) {
          return undefined;
        }
        object = proxy.__proxy__.object;
        define = proxy.__proxy__.getPropertyDefine(attr);
      }
    }
    return define || {
        value: object[attr],
        writable: true,
        enumerable: true,
        configurable: true
      };
  }, supportDefinePropertyOnDom ? Object.getOwnPropertyDescriptor : null);
}

