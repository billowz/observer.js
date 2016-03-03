/**
 * 修复浏览器(IE 6,7,8)对Object.defineProperty的支持，使用VBProxy
 */
require('./VBProxy');

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
let OBJECT = Object;
if (!Object.defineProperty || !doesDefinePropertyWork({})) {
  if (VBProxy) {
    OBJECT = {
      defineProperty: function(object, prop, desc) {
        var descs = {};
        descs[prop] = desc;
        return OBJECT.defineProperties(object, descs);
      },
      defineProperties: function(object, descs) {
        let proxy, prop, proxyDesc,
          hasAccessor = false, desc;
        if (VBProxy.isVBProxy(object)) {
          proxy = object;
          object = VBProxy.getVBProxyDesc(proxy).object;
        }
        for (prop in descs) {
          desc = descs[prop];
          if (desc.get || desc.set) {
            hasAccessor = true;
            break;
          }
        }
        if (!proxy && !hasAccessor) {
          for (prop in descs) {
            object[prop] = descs[prop].value;
          }
          return object;
        } else {
          // fill non-props
          for (prop in descs) {
            if (!(prop in object)) {
              object[prop] = undefined;
            }
          }
          proxy = VBProxy.createVBProxy(proxy || object);
          proxyDesc = VBProxy.getVBProxyDesc(proxy);
          for (prop in descs) {
            proxyDesc.defineProperty(prop, descs[prop]);
          }
          if (!proxyDesc.hasAccessor()) {
            proxy.__destory__();
            return object;
          }
          return proxy;
        }
      },
      getOwnPropertyDescriptor: function(object, attr) {
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
      }
    };
  }
}
export default OBJECT;
