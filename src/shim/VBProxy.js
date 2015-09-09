if (window.VBArray) {

  require('./collection');

  let VBClassPool = {},
    IDGen = 0;

  function genClassName() {
    return 'VBClass' + (IDGen++);
  }

  function parseVBClassFactoryName(className) {
    return className + 'Factory';
  }

  window.execScript([ // jshint ignore:line
    'Function parseVB(code)',
    '\tExecuteGlobal(code)',
    'End Function' //转换一段文本为VB代码
  ].join('\n'), 'VBScript');

  function genVBClassPropertyGetterScript(name, valueScript) {
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

  let VBClassNormalScript = [
      '\tPrivate [__proxy__]',
      '\tPublic Default Function [__const__](desc)',
      '\t\tset [__proxy__] = desc',
      '\t\tSet [__const__] = Me', //链式调用
      '\tEnd Function'].join('\r\n'),
    VBClassProxyPropertyScript = genVBClassPropertyGetterScript('__proxy__', '[__proxy__]');

  function genVBClassScript(className, properties, accessors) {
    let buffer = [];
    buffer.push('Class ' + className, VBClassNormalScript);

    //添加普通属性,因为VBScript对象不能像JS那样随意增删属性，必须在这里预先定义好
    _.each(properties, (name) => {
      buffer.push("\tPublic [' + name + ']");
    });

    //添加访问器属性
    _.each(accessors, (name) => {
      buffer.push(
        genVBClassPropertySetterScript(name, 'Call [__proxy__].set(Me, "' + name + '", val)'),
        genVBClassPropertyGetterScript(name, '[__proxy__].get(Me, "' + name + '")')
      );
    });

    buffer.push('End Class');
    return buffer.join('\r\n');
  }

  /**
   * 动态创建VB Class
   * @param  Array properties 基本属性
   * @param  Array accessors  访问器属性(get, set)
   * @return VB Class         ${className}Factory(data, proxy)
   */
  function getVBClass(properties, accessors) {
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
    constructor(object) {
      this.object = object;

    }
    defineProperty(attr, desc) {
      this.defines[attr] = desc;
    }
    get(instance, prop) {
      console.log('--->get property ' + prop)
    }
    set(instance, prop, value) {
      this.object[prop] = value;
      console.log('--->set property ' + prop + '=' + value + ' ' + this.object.a)
    }
  }

  function Proxy(proxy, target, prop, value) { // jshint ignore:line
    console.log('-->>' + target + ' ' + prop + ' ' + value + ' ' + arguments.length)
  }

  let VBProxyLoop = new Map();

  function genVBProxy(object) {
    let proxy = VBProxyLoop.get(object);
    if (proxy == null) {
      let desc = new ObjectDescriptor(object),
        accessors = _.keys(object),
        props = [],
        factoryName = getVBClass(props, accessors);
      proxy = window[factoryName](desc);
    }
    return proxy;
  }

  window.genVBProxy = genVBProxy;
  window.VBClassPool = VBClassPool;
  window.VBProxyLoop = VBProxyLoop;
}
