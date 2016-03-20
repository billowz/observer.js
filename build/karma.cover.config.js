var base = require('./karma.base.config.js')

module.exports = function(config) {
  var options = Object.assign(base, {
    browsers: ['PhantomJS'],
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      reporters: [
        {
          type: 'lcov',
          dir: '../coverage',
          subdir: '.'
        },
        {
          type: 'text-summary',
          dir: '../coverage',
          subdir: '.'
        }
      ]
    }
  })

  options.preprocessors['../src/**/*[!.spec].js'] = 'coverage'
  options.plugins.push(require('karma-phantomjs-launcher'), require('karma-coverage'));
  config.set(options)
}
