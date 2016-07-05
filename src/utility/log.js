const _ = require('./util')

const logLevels = ['debug', 'info', 'warn', 'error'],
  tmpEl = document.createElement('div'),
  slice = Array.prototype.slice

const SimulationConsole = _.dynamicClass({
  constructor() {
    tmpEl.innerHTML = `<div id="simulation_console"
    style="position:absolute; top:0; right:0; font-family:courier,monospace; background:#eee; font-size:10px; padding:10px; width:200px; height:200px;">
  <a style="float:right; padding-left:1em; padding-bottom:.5em; text-align:right;">Clear</a>
  <div id="simulation_console_body"></div>
</div>`
    this.el = tmpEl.childNodes[0]
    this.clearEl = this.el.childNodes[0]
    this.bodyEl = this.el.childNodes[1]
  },
  appendTo(el) {
    el.appendChild(this.el)
  },
  log(style, msg) {
    tmpEl.innerHTML = `<span style="${style}">${msg}</span>`
    this.bodyEl.appendChild(tmpEl.childNodes[0])
  },
  parseMsg(args) {
    let msg = args[0]

    if (_.isString(msg)) {
      let f = _._format.apply(_, args)

      return [f.format].concat(slice.call(args, f.formatArgCount)).join(' ')
    }
    return args.join(' ')
  },
  debug() {
    this.log('color: red;', this.parseMsg(arguments))
  },
  info() {
    this.log('color: red;', this.parseMsg(arguments))
  },
  warn() {
    this.log('color: red;', this.parseMsg(arguments))
  },
  error() {
    this.log('color: red;', this.parseMsg(arguments))
  },
  clear() {
    this.bodyEl.innerHTML = ''
  }
})


let console = window.console

if (console && !console.debug)
  console.debug = function() {
    console.log.apply(this, arguments)
  }

export const Logger = _.dynamicClass({
  constructor(_module, level) {
    this.module = _module
    this.level = _.indexOf(logLevels, level || 'info')
  },
  setLevel(level) {
    this.level = _.indexOf(logLevels, level || 'info')
  },
  getLevel() {
    return logLevels[this.level]
  },
  _print(level, args, trace) {
    console[level].apply(console, args)
    if (trace && console.trace)
      console.trace()
  },
  _log(level, args, trace) {
    if (level < this.level || !console)
      return
    let msg = '[%s] %s -' + (_.isString(args[0]) ? ' ' + args.shift() : ''),
      errors = []

    args = _.filter(args, arg => {
      if (arg instanceof Error) {
        errors.push(arg)
        return false
      }
      return true
    })
    _.each(errors, err => {
      args.push.call(args, err.message, '\n', err.stack)
    })
    level = logLevels[level]
    this._print(level, [msg, level, this.module].concat(args), trace)
  },
  debug() {
    this._log(0, slice.call(arguments, 0))
  },
  info() {
    this._log(1, slice.call(arguments, 0))
  },
  warn() {
    this._log(2, slice.call(arguments, 0))
  },
  error() {
    this._log(3, slice.call(arguments, 0))
  }
})

Logger.enableSimulationConsole = function enableSimulationConsole() {
  if (!console) {
    console = new SimulationConsole()
    console.appendTo(document.body)
  }
}
export const logger = new Logger('default', 'info')
