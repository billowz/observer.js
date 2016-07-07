let _ = require('./util')

let Configuration = _.dynamicClass({
  constructor(def) {
    this.cfg = def || {}
  },
  register(name, defVal) {
    if (arguments.length == 1) {
      _.each(name, (val, name) => {
        this.cfg[name] = val
      })
    } else {
      this.cfg[name] = defVal
    }
    return this
  },
  config(cfg) {
    if(cfg)
      _.each(this.cfg, (val, key) => {
        if (_.hasOwnProp(cfg, key))
          this.cfg[key] = cfg[key]
      })
    return this
  },
  get(name) {
    return arguments.length ? this.cfg[name] : _.create(this.cfg)
  }
})
module.exports = Configuration
