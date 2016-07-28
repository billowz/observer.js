var baseCfg = require('./karma.config'),
  pkg = require('../package.json')

module.exports = function(config) {
  baseCfg(config)
  config.set({
    browsers: Object.keys(browsers),
    customLaunchers: browsers,
    reporters: ['spec', 'saucelabs'],
    sauceLabs: {
      testName: 'utility.js unit tests',
      username: 'utility-js',
      accessKey: '6b589fb2-460b-46d7-a272-8e9646bfb0d7',
      tags: ['v' + pkg.version],
      'public': 'public'
    },
    // mobile emulators are really slow
    captureTimeout: 300000,
    browserNoActivityTimeout: 300000
  })
}

var browsers = {
  sl_chrome: {
    base: 'SauceLabs',
    browserName: 'chrome',
    platform: 'Windows 7'
  },
  sl_firefox: {
    base: 'SauceLabs',
    browserName: 'firefox',
    platform: 'Windows 7',
    version: '44'
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
