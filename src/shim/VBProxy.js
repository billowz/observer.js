/**
 * 使用VBScript对象代理js对象的get/set方法, 参考Avalon实现
 * @see  https://github.com/RubyLouvre/avalon/blob/master/src/08%20modelFactory.shim.js
 */
const coll = require('./collection');

let OBJECT_PROTO_PROPS = ['hasOwnProperty', 'toString', 'toLocaleString', 'isPrototypeOf', 'propertyIsEnumerable', 'valueOf'],
  ARRAY_PROTO_PROPS = ['concat', 'copyWithin', 'entries', 'every', 'fill', 'filter', 'find', 'findIndex', 'forEach', 'indexOf', 'lastIndexOf', 'length', 'map', 'keys', 'join', 'pop', 'push', 'reverse', 'reverseRight', 'some', 'shift', 'slice', 'sort', 'splice', 'toSource', 'unshift'],
  DESC_BINDING = '__PROXY__',
  CONST_BINDING = '__VB_CONST__',
  CONST_SCRIPT = [
    '\tPublic [' + DESC_BINDING + ']',
    '\tPublic Default Function [' + CONST_BINDING + '](desc)',
    '\t\tset [' + DESC_BINDING + '] = desc',
    '\t\tSet [' + CONST_BINDING + '] = Me',
    '\tEnd Function'
  ].join('\r\n'),
  VBClassPool = {},
  VBProxyLoop = new Map(),
  classId = 0,
  support;

function isSupported() {
  if (support === undefined) {
    if (window.VBArray) {
      try {
        window.execScript([ // jshint ignore:line
          'Function parseVB(code)',
          '\tExecuteGlobal(code)',
          'End Function' //转换一段文本为VB代码
        ].join('\n'), 'VBScript');
        support = true;
      } catch (e) {
        support = false;
        console.error(e.message, e);
      }
    } else {
      support = false;
    }
  }
  return support;
}

function genClassName() {
  return 'VBClass' + (classId++);
}

function parseVBClassFactoryName(className) {
  return className + 'Factory';
}

function genVBClassPropertyGetterScript(name, valueScript) {
  return [
    '\tPublic Property Get [' + name + ']',
    '\tOn Error Resume Next', //必须优先使用set语句,否则它会误将数组当字符串返回
    '\t\tSet[' + name + '] = ' + valueScript,
    '\tIf Err.Number <> 0 Then',
    '\t\t[' + name + '] = ' + valueScript,
    '\tEnd If',
    '\tOn Error Goto 0',
    '\tEnd Property'
  ].join('\r\n');
}

function genVBClassPropertySetterScript(name, valueScript) {
  return [
    '\tPublic Property Let [' + name + '](val)',
    '\t\t' + valueScript,
    '\tEnd Property',
    '\tPublic Property Set [' + name + '](val)', //setter
    '\t\t' + valueScript,
    '\tEnd Property',
  ].join('\r\n');
}

function genVBClassScript(className, properties, accessors) {
  let buffer = [], i, j, name,
    added = [];

  buffer.push('Class ' + className, CONST_SCRIPT);

  //添加访问器属性
  accessors.forEach(name => {
    buffer.push(
      genVBClassPropertySetterScript(name, 'Call [' + DESC_BINDING + '].set(Me, "' + name + '", val)'),
      genVBClassPropertyGetterScript(name, '[' + DESC_BINDING + '].get(Me, "' + name + '")')
    );
    added.push(name);
  });
  //添加普通属性,因为VBScript对象不能像JS那样随意增删属性，必须在这里预先定义好
  properties.forEach(name => {
    if (added.indexOf(name) == -1) {
      buffer.push('\tPublic [' + name + ']');
    }
  });

  buffer.push('End Class');
  return buffer.join('\r\n');
}
function genVBClass(properties, accessors) {
  let buffer = [], className, factoryName,
    key = '[' + properties.join(',') + ']&&[' + accessors.join(',') + ']';
  className = VBClassPool[key];
  if (className) {
    return parseVBClassFactoryName(className);
  } else {
    className = genClassName();
    factoryName = parseVBClassFactoryName(className);
    window.parseVB(genVBClassScript(className, properties, accessors));
    window.parseVB([
      'Function ' + factoryName + '(desc)', //创建实例并传入两个关键的参数
      '\tDim o',
      '\tSet o = (New ' + className + ')(desc)',
      '\tSet ' + factoryName + ' = o',
      'End Function'
    ].join('\r\n'));
    VBClassPool[key] = className;
    return factoryName;
  }
}

class ObjectDescriptor {
  constructor(object, defines) {
    this.object = object;
    this.defines = defines || {};
  }
  isAccessor(desc) {
    return desc.get || desc.set;
  }
  hasAccessor() {
    for (let attr in this.defines) {
      if (this.isAccessor(this.defines[attr])) {
        return true;
      }
    }
    return false;
  }
  defineProperty(attr, desc) {
    if (!this.isAccessor(desc)) {
      delete this.defines[attr];
    } else {
      this.defines[attr] = desc;
      if (desc.get) {
        this.object[attr] = desc.get();
      }
    }
  }
  getPropertyDefine(attr) {
    return this.defines[attr];
  }
  get(instance, attr) {
    let define = this.defines[attr];
    if (define && define.get) {
      return define.get.call(instance);
    } else {
      return this.object[attr];
    }
  }
  set(instance, attr, value) {
    let define = this.defines[attr];
    if (define && define.set) {
      define.set.call(instance, value);
    }
    this.object[attr] = value;
  }
}

function createVBProxy(object, desc) {
  let accessors = [],
    props = ['__hash__', '__destory__'], i, bind;
  desc = desc || new ObjectDescriptor(object);
  for (name in object) {
    accessors.push(name);
  }

  props = props.concat(OBJECT_PROTO_PROPS);
  if (Object.prototype.toString.call(object) === '[object Array]') {
    props = props.concat(ARRAY_PROTO_PROPS);
  }

  proxy = window[genVBClass(props, accessors)](desc);

  proxy['hasOwnProperty'] = function hasOwnProperty(attr) {
    return attr !== DESC_BINDING && attr !== CONST_BINDING && props.indexOf(attr) == -1;
  }
  proxy.__destory__ = function() {
    if (VBProxyLoop.get(object) === proxy) {
      VBProxyLoop.delete(object);
    }
  }
  props.forEach(name => {
    if (typeof proxy[name] === 'undefined') {
      bind = object[name];
      if (typeof bind === 'function') {
        bind = bind.bind(object);
      }
      proxy[name] = bind;
    }
  });
  return proxy;
}

let VBProxy = {
  isSupport: isSupported,
  isVBProxy(object) {
    return object && (typeof object == 'object') && (CONST_BINDING in object);
  },
  getVBProxy(object, justInPool) {
    if (VBProxy.isVBProxy(object)) {
      if (justInPool === false) {
        return VBProxyLoop.get(object[DESC_BINDING].object) || object;
      }
      object = object[DESC_BINDING].object;
    }
    return VBProxyLoop.get(object);
  },
  getVBProxyDesc(object) {
    let proxy = VBProxy.isVBProxy(object) ? object : VBProxyLoop.get(object);
    return proxy ? proxy[DESC_BINDING] : undefined;
  },
  createVBProxy(object) {
    let proxy = VBProxy.getVBProxy(object, false),
      rebuild = false, name, desc;
    if (proxy) {
      object = proxy[DESC_BINDING].object;
      for (name in object) {
        if (!(name in proxy)) {
          rebuild = true;
          break;
        }
      }
      if (!rebuild) {
        return proxy;
      }
      desc = proxy[DESC_BINDING];
    }
    proxy = createVBProxy(object, desc);
    VBProxyLoop.set(object, proxy);
    return proxy;
  }
}

/*
if (isSupported()) {

  function fixPrototypeProp(Type, name) {
    let fn = Type.prototype[name];
    if (typeof fn === 'function') {
      Type.prototype[name] = function() {
        if (VBProxy.isVBProxy(this)) {
          return fn.apply(this[DESC_BINDING].object, arguments);
        }
        return fn.apply(this, arguments);
      }
    }
  }
  function fixPrototypeProps(Type, props) {
    for (let i = 0; i < props.length; i++) {
      fixPrototypeProp(Type, props[i]);
    }
  }

  fixPrototypeProps(Object, OBJECT_PROTO_PROPS);
  fixPrototypeProps(Array, ARRAY_PROTO_PROPS);

}
*/

window.VBProxy = VBProxy;
module.exports = VBProxy;
