var babel = require('rollup-plugin-babel')

module.exports = function(option) {
  return babel(Object.assign({
    runtimeHelpers: false,
    exclude: 'node_modules/**',
    presets: ["es2015-loose-rollup"],
    plugins: [
      "transform-es3-member-expression-literals",
      "transform-es3-property-literals"
    ]
  }, option || {}))
}
