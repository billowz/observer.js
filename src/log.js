const _ = require('./util')

const SimulationConsole = _.dynamicClass({
  constructor() {
    this.el = document.createElement('div')
    this.el.innerHTML = ['<div id = "__console__" ',
      'style = "position:absolute; top:0; right:0; width:', document.body.clientWidth * 0.7, '; border:1px solid #999;',
      'font-family:courier,monospace; background:#eee; font-size:10px; padding:10px;">',
      '<a style = "float:right; padding-left:1em; padding-bottom:.5em; text-align:right;" ',
      'href="javascript:console.hide()">Close</a>',
      '<a style = "float:right; padding-left:1em; padding-bottom:.5em; text-align:right;" ',
      'href="javascript:console.clear()">Clear</a>',
      '</div>'
    ].join('')
  },
  hide: function() {
    el.style.display = 'none';
  },
  show: function() {
    el.style.display = 'block';
  },
  log: function(o) {
    el.innerHTML += '<br/>' + o;
    console.show();
  },
  clear: function() {
    el.parentNode.removeChild(el);
    el = undefined;
    init();
    console.show();
  }
})

if(!window.console)
  window.console = new SimulationConsole()

if(!window.console.debug)
  window.console.debug = function(){
    window.console.log.apply(this, arguments)
  }

const logLevels = ['debug', 'info', 'warn', 'error']
export const Logger = _.dynamicClass({
  constructor(_module, level) {
    this.module = _module
    this.level = _.indexOf(logLevels, level || 'debug')
  },
  _print(level, args, trace) {
    window.console[level].apply(window.console, args)
    if (trace && console.trace)
      console.trace()
  },
  _log(level, args, trace) {
    if (level <= this.level) {
      let msg = '[%s] %s -' + (_.isString(args[0]) ? ' ' + args.shift() : ''),
        level = logLevels[level],
        errors = []

      args = _.filter(args, arg => {
        if(arg instanceof Error){
          errors.push(arg)
          return false
        }
        return true
      })

      _.each(errors, err=>{
        arg.push.call(arg, err.message, '\n', err.stack)
      })

      args = [msg, level, this.module].concat(args)
      this._print(level, args, trace)
    }
  },
  debug() {
    this._log(0, arguments)
  },
  info() {
    this._log(1, arguments)
  },
  warn() {
    this._log(2, arguments)
  },
  error() {
    this._log(3, arguments)
  }
})
