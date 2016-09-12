const nodeResolve = require('rollup-plugin-node-resolve-ext'),
  cfg = require('./rollup.config')

module.exports = {
  rollup: Object.assign({}, cfg.rollup, {
    plugins: [nodeResolve({
      alias: {
        'utility': 'utility.js'
      }
    })].concat(cfg.rollup.plugins)
  }),
  bundle: Object.assign({}, cfg.bundle, {
    dest: cfg.bundle.dest.replace(/\.js$/, '.all.js')
  })
}
