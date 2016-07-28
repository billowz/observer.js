var compile = require('./compile'),
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
  banner: banner
})
