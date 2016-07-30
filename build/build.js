var compile = require('./compile'),
  inject = require('rollup-plugin-inject'),
  nodeResolve = require('rollup-plugin-node-resolve'),
  babel = require('./rollup-babel'),
  pkg = require('../package.json'),
  banner = `/*
 * ${pkg.name} v${pkg.version} built in ${new Date().toUTCString()}
 * Copyright (c) 2016 ${pkg.author}
 * Released under the ${pkg.license} license
 * support IE6+ and other browsers
 *${pkg.homepage}
 */`

var cfg = {
  module: pkg.namespace,
  entry: pkg.main,
  useStrict: false,
  banner: banner,
  globals: {
    'utility': 'utility'
  },
  external: Object.keys(pkg.dependencies)
}

compile('dist/observer.js', Object.assign({
  plugins: [babel()]
}, cfg)).then(function() {
  compile('dist/observer.all.js', Object.assign({
    plugins: [inject({
      utility: 'utility.js'
    }), nodeResolve({
      jsnext: true
    }), babel()]
  }, cfg))
})
