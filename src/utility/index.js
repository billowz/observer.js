require('./polyfill')
const util = require('./util')

module.exports = util.assignIf({
  util: require('./util'),
  timeoutframe: require('./timeoutframe')
}, require('./log'))
