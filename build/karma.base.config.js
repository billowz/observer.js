var webpackCfg = require('./webpack.dev.config.js')
delete webpackCfg.entry
webpackCfg.devtool = 'inline-source-map'
module.exports = {
  transports: ['websocket', 'polling', 'jsonp-polling'],

  frameworks: ['mocha', 'expect'],

  files: [
    '../node_modules/observer.js/dist/observer.js',
    '../src/__tests__/index.spec.js'
  ],

  preprocessors: {
    '../src/__tests__/index.spec.js': ['webpack']
  },

  webpack: webpackCfg,

  plugins: [
    require('karma-mocha'),
    require('karma-expect'),
    require('karma-webpack')
  ],

  concurrency: Infinity,

  client: {
    clearContext: false,
    captureConsole: false,
    mocha: {
      reporter: 'html', // change Karma's debug.html to the mocha web reporter
      ui: 'bdd'
    }
  },

  singleRun: true,

  colors: true
}
