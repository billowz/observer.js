var compile = require('./compile'),
  alias = require('rollup-plugin-alias'),
  inject = require('rollup-plugin-inject'),
  nodeResolve = require('rollup-plugin-node-resolve'),
  pkg = require('../package.json'),
  banner = `/*
 * ${pkg.name} v${pkg.version} built in ${new Date().toUTCString()}
 * Copyright (c) 2016 ${pkg.author}
 * Released under the ${pkg.license} license
 * support IE6+ and other browsers
 *${pkg.homepage}
 */`

compile({
  module: pkg.module,
  useStrict: false,
  entry: pkg.entry,
  dest: pkg.main,
  banner: banner,
  plugins: [nodeResolve({
    jsnext: true
  })],
  globals: {
    utility: 'utility'
  },
  external: Object.keys(pkg.dependencies)
})
console.log(Object.keys(pkg.dependencies))
