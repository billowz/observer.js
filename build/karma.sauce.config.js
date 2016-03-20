var base = require('./karma.base.config.js')
var batch = {
  sl_chrome: {
    base: 'SauceLabs',
    browserName: 'chrome',
    platform: 'Windows 7'
  },
  sl_firefox: {
    base: 'SauceLabs',
    browserName: 'firefox'
  },
  sl_mac_safari: {
    base: 'SauceLabs',
    browserName: 'safari',
    platform: 'OS X 10.10'
  },
  sl_ie_11: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 8.1',
    version: '11'
  },
  sl_ie_10: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 8',
    version: '10'
  },
  sl_ie_9: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 7',
    version: '9'
  },
  sl_ie_8: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 7',
    version: '8'
  },
  sl_ie_7: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows XP',
    version: '7'
  },
  sl_ie_6: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows XP',
    version: '6'
  }
}

module.exports = function(config) {
  var options = Object.assign(base, {
    browsers: Object.keys(batch),
    customLaunchers: batch,
    reporters: ['progress', 'saucelabs'],
    sauceLabs: {
      testName: 'observer.js unit tests',
      username: 'observer_js',
      accessKey: '0a943154-ae00-4742-bb2b-6a87cf2d13b3'
    },
    port: 9876,
    // mobile emulators are really slow
    captureTimeout: 300000,
    browserNoActivityTimeout: 300000
  });

  options.plugins.push(require('karma-sauce-launcher'));
  config.set(options)
}
