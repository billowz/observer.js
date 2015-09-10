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
    if (isAccessor(desc)) {
      // use VBProxy
      if (VBProxy.isSupport()) {
        let proxy = VBProxy.getVBProxy(object);
        if (proxy != null) {
          object = proxy.__proxy__.object;
        }
        if (proxy == null || !(prop in proxy)) {
          proxy = buildProxy(proxy, object, [prop]);
        }
        proxy.__proxy__.defineProperty(prop, desc);
        return proxy;
      } else {
        console.error('defineProperty is unSupported on this Browser.') ;
        object[prop] = desc.get ? desc.get() : desc.value;
      }
    } else {
      if (VBProxy.isSupport()) {
        let proxy = VBProxy.getVBProxy(object);
        if (proxy != null) {
          object = proxy.__proxy__.object;
          if (!(prop in proxy)) {
            proxy = buildProxy(proxy, object, [prop]);
          }
          proxy.__proxy__.defineProperty(prop, desc);
          return proxy;
        }
      }
      object[prop] = desc.value;
    }
    return object;
  }, supportDefinePropertyOnDom ? Object.defineProperty : null);
  fixObject('defineProperties', function(object, descs) {
    let prop, desc,
      accessors = {};
    for (prop in descs) {
      desc = descs[prop];
      if ('get' in desc || 'set' in desc) {

      }
      props.push(prop);
    }

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

