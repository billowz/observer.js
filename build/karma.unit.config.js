var base = require('./karma.base.config.js')

module.exports = function(config) {
  var options = Object.assign(base, {
    browsers: ['Chrome'],
    reporters: ['progress'],
    autoWatch: true,
    singleRun: false
  });

  options.plugins.push(require('karma-chrome-launcher'));
  config.set(options);
}
