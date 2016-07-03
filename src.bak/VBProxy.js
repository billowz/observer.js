const Map = require('./map'),
  _ = require('./util')

export function VBProxyFactory(onProxyChange) {
  let OBJECT_PROTO_PROPS = [Map.HASH_BIND, 'hasOwnProperty', 'toString', 'toLocaleString', 'isPrototypeOf', 'propertyIsEnumerable', 'valueOf'],
    ARRAY_PROTO_PROPS = OBJECT_PROTO_PROPS.concat(['concat', 'copyWithin', 'entries', 'every', 'fill', 'filter',
      'find', 'findIndex', 'forEach', 'indexOf', 'lastIndexOf', 'length', 'map', 'keys', 'join', 'pop', 'push',
      'reverse', 'reverseRight', 'some', 'shift', 'slice', 'sort', 'splice', 'toSource', 'unshift']),
    OBJECT_PROTO_PROPS_MAP = {},
    ARRAY_PROTO_PROPS_MAP = {},
    DESC_BINDING = '__VB_PROXY__',
    CONST_BINDING = '__VB_CONST__',
    CONST_SCRIPT = [
      '\tPublic [', DESC_BINDING, ']\r\n',
      '\tPublic Default Function [', CONST_BINDING, '](desc)\r\n',
      '\t\tset [', DESC_BINDING, '] = desc\r\n',
      '\t\tSet [', CONST_BINDING, '] = Me\r\n',
      '\tEnd Function\r\n'
    ].join(''),
    VBClassPool = {},
    ClassNameGenerator = 0,
    hasOwn = Object.prototype.hasOwnProperty;

  for (let i = OBJECT_PROTO_PROPS.length - 1; i >= 0; i--) {
    OBJECT_PROTO_PROPS_MAP[OBJECT_PROTO_PROPS[i]] = true;
  }
  for (let i = ARRAY_PROTO_PROPS.length - 1; i >= 0; i--) {
    ARRAY_PROTO_PROPS_MAP[ARRAY_PROTO_PROPS[i]] = true;
  }

  function generateVBClassName() {
    return `VBClass${ClassNameGenerator++}`
  }

  function parseVBClassConstructorName(className) {
    return `${className}Constructor`
  }

  function generateSetter(attr) {
    return [
      '\tPublic Property Get [', attr, ']\r\n',
      '\tOn Error Resume Next\r\n',
      '\t\tSet[', attr, '] = [', DESC_BINDING, '].get("', attr, '")\r\n',
      '\tIf Err.Number <> 0 Then\r\n',
      '\t\t[', attr, '] = [', DESC_BINDING, '].get("', attr, '")\r\n',
      '\tEnd If\r\n',
      '\tOn Error Goto 0\r\n',
      '\tEnd Property\r\n'
    ];
  }

  function generateGetter(attr) {
    return [
      '\tPublic Property Let [', attr, '](val)\r\n',
      '\t\tCall [', DESC_BINDING, '].set("', attr, '",val)\r\n',
      '\tEnd Property\r\n',
      '\tPublic Property Set [', attr, '](val)\r\n',
      '\t\tCall [', DESC_BINDING, '].set("', attr, '",val)\r\n',
      '\tEnd Property\r\n',
    ];
  }

  function generateVBClass(VBClassName, properties, funcMap) {
    let buffer, i, l, attr;

    buffer = ['Class ', VBClassName, '\r\n', CONST_SCRIPT, '\r\n'];
    for (i = 0, l = properties.length; i < l; i++) {
      attr = properties[i];
      if (funcMap[attr]) {
        buffer.push('\tPublic [' + attr + ']\r\n')
      } else {
        buffer.push.apply(buffer, generateSetter(attr));
        buffer.push.apply(buffer, generateGetter(attr));
      }
    }
    buffer.push('End Class\r\n');
    return buffer.join('');
  }

  function generateVBClassConstructor(properties, funcMap, funcArray) {
    let key = [properties.length, '[', properties.join(','), ']', '[', funcArray.join(','), ']'].join(''),
      VBClassConstructorName = VBClassPool[key];

    if (VBClassConstructorName)
      return VBClassConstructorName;

    let VBClassName = generateVBClassName();
    VBClassConstructorName = parseVBClassConstructorName(VBClassName);
    parseVB(generateVBClass(VBClassName, properties, funcMap));
    parseVB([
      'Function ', VBClassConstructorName, '(desc)\r\n',
      '\tDim o\r\n',
      '\tSet o = (New ', VBClassName, ')(desc)\r\n',
      '\tSet ', VBClassConstructorName, ' = o\r\n',
      'End Function'
    ].join(''));
    VBClassPool[key] = VBClassConstructorName;
    return VBClassConstructorName;
  }


  function createVBProxy(object, desc) {
    let isArray = object instanceof Array,
      props = [],
      funcMap = {},
      funcArray = [], prop, proxy, protoProps, protoPropMap;

    if (isArray) {
      protoProps = ARRAY_PROTO_PROPS;
      protoPropMap = ARRAY_PROTO_PROPS_MAP;
    } else {
      protoProps = OBJECT_PROTO_PROPS;
      protoPropMap = OBJECT_PROTO_PROPS_MAP;
    }

    for (let i = 0, l = protoProps.length; i < l; i++) {
      prop = protoProps[i];
      if (typeof object[prop] == 'function') {
        funcMap[prop] = true;
        funcArray.push(prop);
      }
      props.push(prop);
    }
    for (prop in object) {
      if (prop !== DESC_BINDING && !(prop in protoPropMap)) {
        if (typeof object[prop] == 'function') {
          funcMap[prop] = true;
          funcArray.push(prop);
        }
        props.push(prop);
      }
    }
    desc = desc || new ObjectDescriptor(object, props);
    proxy = window[generateVBClassConstructor(props, funcMap, funcArray)](desc);
    for (let i = 0, l = funcArray.length; i < l; i++) {
      prop = funcArray[i];
      proxy[prop] = funcProxy(object[prop], proxy);
    }
    desc.proxy = proxy;
    onProxyChange(object, proxy);
    return proxy;
  }

  function funcProxy(fn, proxy) {
    return function() {
      fn.apply((!this || this == window) ? proxy : this, arguments);
    };
  }

  class ObjectDescriptor {
    constructor(object, props) {
      let defines = {};
      for (let i = 0, l = props.length; i < l; i++) {
        defines[props[i]] = false;
      }
      this.object = object;
      this.defines = defines;
      object[DESC_BINDING] = this;
      this.accessorNR = 0;
    }

    isAccessor(desc) {
      return desc && (desc.get || desc.set);
    }

    hasAccessor() {
      return !!this.accessorNR;
    }

    defineProperty(attr, desc) {
      if (!(attr in this.defines)) {
        if (!(attr in this.object)) {
          this.object[attr] = undefined;
        } else if (typeof this.object[attr] == 'function') {
          console.warn('defineProperty not support function [' + attr + ']')
        }
        _createVBProxy(this.object, this);
      }
      if (!this.isAccessor(desc)) {
        if (this.defines[attr]) {
          this.defines[attr] = false;
          this.accessorNR--;
        }
        this.object[attr] = desc.value;
      } else {
        this.accessorNR++;
        this.defines[attr] = desc;
        if (desc.get)
          this.object[attr] = desc.get();
      }
      return this.proxy;
    }

    getPropertyDefine(attr) {
      return this.defines[attr] || undefined;
    }

    get(attr) {
      let define = this.defines[attr],
        ret;
      if (define && define.get) {
        return define.get.call(this.proxy);
      } else
        return this.object[attr];
    }

    set(attr, value) {
      let define = this.defines[attr];
      if (define && define.set)
        define.set.call(this.proxy, value);
      this.object[attr] = value;
    }
  }

  let api = {
    eq(obj1, obj2) {
      let desc1 = api.getVBProxyDesc(obj1),
        desc2 = api.getVBProxyDesc(obj2);
      if (desc1)
        obj1 = desc1.object;
      if (desc2)
        obj2 = desc2.object;
      return obj1 === obj2;
    },

    obj(object) {
      if (!object) return object;
      let desc = api.getVBProxyDesc(object);
      return desc ? desc.object : object;
    },

    isVBProxy(object) {
      return hasOwn.call(object, CONST_BINDING);
    },

    getVBProxy(object) {
      let desc = api.getVBProxyDesc(object);
      return desc ? desc.proxy : undefined;
    },

    getVBProxyDesc(object) {
      if (!object || !hasOwn.call(object, DESC_BINDING))
        return undefined;
      return object[DESC_BINDING];
    },

    createVBProxy(object) {
      let desc = api.getVBProxyDesc(object);

      if (desc) {
        object = desc.object;
      }
      return createVBProxy(object, desc);
    },

    freeVBProxy(object) {
      let desc = api.getVBProxyDesc(object);
      if (desc)
        onProxyChange(object, undefined);
      return object;
    }
  }
  return api;
}

let supported = undefined;
VBProxyFactory.isSupport = function isSupport() {
  if (supported !== undefined)
    return supported;
  supported = false;
  if (window.VBArray) {
    try {
      window.execScript([
        'Function parseVB(code)',
        '\tExecuteGlobal(code)',
        'End Function'
      ].join('\n'), 'VBScript');
      supported = true;
    } catch (e) {
      console.error(e.message, e);
    }
  }
  return supported;
}