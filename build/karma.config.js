var babel = require('./rollup-babel'),
  multiEntry = require('rollup-plugin-multi-entry'),
  coverage = require('rollup-plugin-coverage'),
  nodeResolve = require('rollup-plugin-node-resolve-ext')

module.exports = function(config) {
  config.set({
    browsers: ['PhantomJS'],
    singleRun: true,
    transports: ['websocket', 'polling', 'jsonp-polling'],
    frameworks: ['mocha', 'expect'],
    reporters: ['spec', 'istanbul'],
    files: ['../src/**/*.spec.js'],
    preprocessors: {
      '../src/**/*.spec.js': ['rollup']
    },
    rollupPreprocessor: {
      rollup: {
        plugins: [nodeResolve({
          alias: {
            'utility': 'utility.js'
          }
        }), babel(), multiEntry(), coverage({
          // instrumenter, include, exclude, instrumenterConfig(codeGenerationOptions, noCompact)
          exclude: ['src/**/__tests__/**', 'node_modules/**'],
          instrumenterConfig: {
            //noCompact: true
          }
        })]
      },
      bundle: {
        sourceMap: 'inline',
        useStrict: false
      }
    },
    autoWatch: true,
    istanbulReporter: {
      dir: '../coverage/',
      reporters: [{
        type: 'lcov'
      }, {
        type: 'text-summary'
      }]
    },
    concurrency: Infinity,
    client: {
      clearContext: false,
      captureConsole: false,
      mocha: {
        reporter: 'html', // change Karma's debug.html to the mocha web reporter
        ui: 'bdd'
      }
    },
    colors: true
  })
}
