var fs = require('fs'),
  zlib = require('zlib'),
  rollup = require('rollup').rollup,
  uglify = require('rollup-plugin-uglify'),
  babel = require('./rollup-babel'),
  rollupOptions = 'entry,cache,external,paths,onwarn,plugins,treeshake,acorn'.split(',')

function complie(opt, dest, plugins) {
  var cfg = {}
  rollupOptions.forEach(function(name) {
    cfg[name] = opt[name]
  })
  cfg.plugins = [babel()].concat(opt.plugins || []).concat(plugins || [])

  return rollup(cfg).then(function(bundle) {
    var res = bundle.generate({
      format: 'umd',
      banner: opt.banner,
      moduleId: opt.module,
      moduleName: opt.module,
      useStrict: opt.useStrict,
      sourceMap: true,
      dest: dest,
      globals: opt.globals
    })

    return Promise.all([
      write(dest, res.code + '\n//# sourceMappingURL=' + dest.replace(/(.*\/)|(.*\\)/g, '') + '.map'),
      write(dest + '.map', JSON.stringify(res.map))
    ])
  })
}

module.exports = function(opt) {
  return complie(opt, opt.dest)
    .then(function(dest) {
      return complie(opt, dest[0].replace(/\.js$/, '.min.js'), [uglify()])
    })
    .then(function(dest) {
      return new Promise(function(resolve, reject) {
        fs.readFile(dest[0], function(err, buf) {
          if (err) return reject(err)
          zlib.gzip(buf, function(err, buf) {
            if (err) return reject(err)
            write(dest[0] + '.gz', buf).then(resolve).catch(reject)
          })
        })
      })
    })
    .catch(function(e) {
      console.error(e)
    })
}

function write(dest, code) {
  return new Promise(function(resolve, reject) {
    fs.writeFile(dest, code, function(err) {
      if (err) return reject(err)
      console.log('complie and output: ', dest + ' (' + size(code) + ')')
      resolve(dest)
    })
  })
}

function size(code) {
  return (code.length / 1024).toFixed(2) + 'kb'
}
