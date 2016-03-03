import proxy from './proxyEvent'
import exp from './expFactory'

exp.proxy = proxy;
exp.obj = proxy.obj.bind(proxy);
exp.eq = proxy.eq.bind(proxy);
window.observer = exp;
export default exp
