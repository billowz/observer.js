var baseCfg = require('./karma.config')

module.exports = function(config) {
  baseCfg(config)
  config.set({
    browsers: ['Chrome'],
    singleRun: false
  })
}
