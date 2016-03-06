/**
 * 修复浏览器(IE 6,7,8)对Object.defineProperty的支持，使用VBProxy
 */
const _ = require('./util');

function doesDefinePropertyWork(OBJECT, object) {
  try {
    let val;
    OBJECT.defineProperty(object, 'sentinel', {
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
if (!Object.defineProperty || !doesDefinePropertyWork(Object, {})) {

  if ('__defineGetter__' in {}) {
    OBJECT = {
      defineProperty(obj, prop, desc) {
        if ('value' in desc) {
          obj[prop] = desc.value
        }
        if ('get' in desc) {
          obj.__defineGetter__(prop, desc.get)
        }
        if ('set' in desc) {
          obj.__defineSetter__(prop, desc.set)
        }
        return obj
      },

      defineProperties(obj, descs) {
        _.eachObj(descs, (desc, prop) => {
          obj = OBJECT.defineProperty(obj, prop, desc);
        });
        return obj;
      },

      getOwnPropertyDescriptor(object, attr) {
        let get = object.__lookupGetter__(attr),
          set = object.__lookupSetter__(attr),
          desc = {
            writable: true,
            enumerable: true,
            configurable: true
          };
        if (get) {
          desc.get = get;
          desc.set = set;
        } else {
          desc.value = object[attr];
        }
        return desc;
      }
    };
  } else {
    if (require('./VBProxy')) {
      OBJECT = {
        defineProperty(object, prop, desc) {
          let proxy, proxyDesc,
            isAccessor = desc.get || desc.set;

          if (VBProxy.isVBProxy(object)) {
            proxy = object;
            object = VBProxy.getVBProxyDesc(proxy).object;
          }
          if (!proxy && !isAccessor) {
            object[prop] = desc.value;
            return object;
          } else {
            if (!(prop in object))
              object[prop] = undefined;
            proxy = VBProxy.createVBProxy(proxy || object);
            proxyDesc = VBProxy.getVBProxyDesc(proxy);
            proxyDesc.defineProperty(prop, desc);
            if (!proxyDesc.hasAccessor()) {
              proxy.__destory__();
              return object;
            }
            return proxy;
          }
        },
        defineProperties(object, descs) {
          let proxy, proxyDesc,
            hasAccessor;

          if (VBProxy.isVBProxy(object)) {
            proxy = object;
            object = VBProxy.getVBProxyDesc(proxy).object;
          }
          hasAccessor = _.eachObj(descs, (desc, prop) => {
              return !(desc.get && desc.set);
            }) === false;

          if (!proxy && !hasAccessor) {
            _.eachObj(descs, (desc, prop) => {
              object[prop] = desc.value;
            });
            return object;
          } else {
            // fill non-props
            _.eachObj(descs, (desc, prop) => {
              if (!(prop in object))
                object[prop] = undefined;
            });
            proxy = VBProxy.createVBProxy(proxy || object);
            proxyDesc = VBProxy.getVBProxyDesc(proxy);
            _.eachObj(descs, (desc, prop) => {
              proxyDesc.defineProperty(prop, desc);
            });
            if (!proxyDesc.hasAccessor()) {
              proxy.__destory__();
              return object;
            }
            return proxy;
          }
        },
        getOwnPropertyDescriptor(object, attr) {
          let proxy, define;
          if (VBProxy.isSupport()) {
            proxy = VBProxy.getVBProxy(object);
            if (proxy) {
              if (!proxy.hasOwnProperty(attr)) {
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
}
module.exports = OBJECT;
