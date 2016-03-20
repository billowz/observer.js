module.exports = {
  transports: ['websocket', 'polling', 'jsonp-polling'],

  frameworks: ['mocha', 'expect', 'commonjs'],

  files: [
    '../src/**/*.js'
  ],

  preprocessors: {
    '../src/**/*.js': ['babel', 'commonjs']
  },

  babelPreprocessor: {
    options: {
      sourceMap: 'inline'
    }
  },

  commonjsPreprocessor: {
    modulesRoot: '../src'
  },

  plugins: [
    require('karma-mocha'),
    require('karma-expect'),
    require('karma-commonjs'),
    require('karma-babel-preprocessor')
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
