var babel = require('rollup-plugin-babel')

module.exports = function(option) {
  option = option || {}
  var plugins = option.plugins
  delete option.plugins
  return babel(Object.assign({
    runtimeHelpers: false,
    presets: ["es2015-loose-rollup"],
    plugins: [
      "transform-es3-member-expression-literals",
      "transform-es3-property-literals"
    ].concat(plugins || [])
  }, option))
}
