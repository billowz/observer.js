
const coll = require('./collection');

let VBProxy = {};
function init() {
  if (!window.VBArray) {
    return;
  }
  let VBClassPool = {},
    IDGen = 0,
    VBClassNormalScript = [
      '\tPublic [__proxy__]',
      '\tPublic Default Function [__vbconst__](desc)',
      '\t\tset [__proxy__] = desc',
      '\t\tSet [__vbconst__] = Me', //链式调用
      '\tEnd Function'
    ].join('\r\n'),
    util = {
      genClassName() {
        return 'VBClass' + (IDGen++);
      },
      parseVBClassFactoryName(className) {
        return className + 'Factory';
      },
      genVBClassPropertyGetterScript(name, valueScript) {
        return [
          '\tPublic Property Get [' + name + ']', //getter
          '\tOn Error Resume Next', //必须优先使用set语句,否则它会误将数组当字符串返回
          '\t\tSet[' + name + '] = ' + valueScript,
          '\tIf Err.Number <> 0 Then',
          '\t\t[' + name + '] = ' + valueScript,
          '\tEnd If',
          '\tOn Error Goto 0',
          '\tEnd Property'
        ].join('\r\n');
      },
      genVBClassPropertySetterScript(name, valueScript) {
        return [
          '\tPublic Property Let [' + name + '](val)',
          '\t\t' + valueScript,
          '\tEnd Property',
          '\tPublic Property Set [' + name + '](val)', //setter
          '\t\t' + valueScript,
          '\tEnd Property',
        ].join('\r\n');
      },
      genVBClassScript(className, properties, accessors) {
        let buffer = [], i, j, name,
          added = [];

        buffer.push('Class ' + className, VBClassNormalScript);

        //添加访问器属性
        for (i = 0; i < accessors.length; i++) {
          name = accessors[i];
          added.push(name);
          buffer.push(
            util.genVBClassPropertySetterScript(name, 'Call [__proxy__].set(Me, "' + name + '", val)'),
            util.genVBClassPropertyGetterScript(name, '[__proxy__].get(Me, "' + name + '")')
          );
        }
        //添加普通属性,因为VBScript对象不能像JS那样随意增删属性，必须在这里预先定义好
        for (i = 0; i < properties.length; i++) {
          name = properties[i];
          if (coll.indexOf(added, name) == -1) {
            buffer.push('\tPublic [' + name + ']');
          }
        }

        buffer.push('End Class');
        return buffer.join('\r\n');
      },
      getVBClass(properties, accessors) {
        let buffer = [], className, factoryName,
          key = '[' + properties.join(',') + ']&&[' + accessors.join(',') + ']';
        className = VBClassPool[key];
        if (className) {
          return util.parseVBClassFactoryName(className);
        } else {
          className = util.genClassName();
          factoryName = util.parseVBClassFactoryName(className);
          window.parseVB(util.genVBClassScript(className, properties, accessors));
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
    },
    VBProxyLoop = new Map(),
    ObjectProtoProps = ['hasOwnProperty', 'toString', 'toLocaleString', 'isPrototypeOf', 'propertyIsEnumerable', 'valueOf'],
    FuncProtoProps = ['apply', 'call', 'constructor', 'prototype', 'name', 'bind'],
    ArrayProtoProps = ['concat', 'copyWithin', 'entries', 'every', 'fill', 'filter', 'find', 'findIndex',
      'forEach', 'indexOf', 'lastIndexOf', 'length', 'map', 'keys', 'join', 'pop', 'push', 'reverse',
      'reverseRight', 'some', 'shift', 'slice', 'sort', 'splice', 'toSource', 'unshift'];

  function isVBProxy(object) {
    return '__vbconst__' in object;
  }

  function getVBProxy(object) {
    if (isVBProxy(object)) {
      object = object.__proxy__.object;
    }
    return VBProxyLoop.get(object);
  }
  function _createVBProxy(object, defines) {
    let desc = new ObjectDescriptor(object, defines),
      accessors = [],
      props = [], i, bind;
    for (name in object) {
      accessors.push(name);
    }
    props = props.concat(ObjectProtoProps);
    if (typeof object === 'function') {
      props = props.concat(FuncProtoProps);
    }
    if (Object.prototype.toString.call(object) === '[object Array]') {
      props = props.concat(ArrayProtoProps);
    }

    proxy = window[util.getVBClass(props, accessors)](desc);
    desc._setProxy(proxy);

    proxy['hasOwnProperty'] = function hasOwnProperty(attr) {
      if (attr === '__proxy__' || attr === '__vbconst__' || coll.indexOf(props, attr) != -1) {
        return false;
      }
      return true;
    }

    for (i = 0; i < props.length; i++) {
      name = props[i];
      if (typeof proxy[name] === 'undefined') {
        bind = object[name];
        if (typeof bind === 'function') {
          bind = bind.bind(object);
        }
        proxy[name] = bind;
      }
    }
    return proxy;
  }
  function createVBProxy(object) {
    let proxy = getVBProxy(object),
      rebuild = false, name, defines;
    if (proxy != null) {
      object = proxy.__proxy__.object;
      for (let name in object) {
        if (!(name in proxy)) {
          rebuild = true;
          break;
        }
      }
      if (!rebuild) {
        return proxy;
      }
      defines = proxy.__proxy__.defines;
      proxy.__proxy__.destory();
    }
    proxy = _createVBProxy(object, defines);
    VBProxyLoop.set(object, proxy);
    return proxy;
  }

  class ObjectDescriptor {
    constructor(object, defines) {
      this.object = object;
      this.defines = defines || {};
    }
    _setProxy(proxy) {
      this._proxy = proxy;
    }
    isDestoried() {
      return !this._proxy;
    }
    destory() {
      if (this._proxy) {
        let pro = VBProxyLoop.get(this.object);
        if (pro && pro === proxy) {
          VBProxyLoop.delete(this.object);
        }
        this._proxy = null;
      }
    }
    defineProperty(attr, desc) {
      this.defines[attr] = desc;
      if (!desc.get && !desc.set) {
        this.object[attr] = desc.value;
      } else {
        if (typeof desc.get !== 'function') {
          delete desc.get;
          this.object[attr] = desc.value;
        } else {
          this.object[attr] = desc.get();
        }
        if (typeof desc.set !== 'function') {
          delete desc.set;
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

  function fixPrototypeProp(Type, name) {
    let fn = Type.prototype[name];
    if (typeof fn === 'function') {
      Type.prototype[name] = function() {
        if (isVBProxy(this)) {
          return fn.apply(this.__proxy__.object, arguments);
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

  fixPrototypeProps(Object, ObjectProtoProps);

  fixPrototypeProps(Array, ArrayProtoProps);

  window.execScript([ // jshint ignore:line
    'Function parseVB(code)',
    '\tExecuteGlobal(code)',
    'End Function' //转换一段文本为VB代码
  ].join('\n'), 'VBScript');

  VBProxy.isVBProxy = isVBProxy;
  VBProxy.createVBProxy = createVBProxy;
  VBProxy.getVBProxy = getVBProxy;
  VBProxy.__support = true;
}

VBProxy.isSupport = function() {
  return VBProxy.init().__support;
}

VBProxy.init = function() {
  if (typeof VBProxy.__support === 'undefined') {
    try {
      init();
      if (typeof VBProxy.__support === 'undefined') {
        VBProxy.__support = false;
      }
    } catch (e) {
      console.error(e.message, e);
      VBProxy.__support = false;
    }
  }
  return VBProxy;
}
window.VBProxy = VBProxy;
module.exports = VBProxy;
