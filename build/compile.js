var fs = require('fs'),
  zlib = require('zlib'),
  rollup = require('rollup').rollup,
  uglify = require('rollup-plugin-uglify'),
  rollupOptions = 'entry,cache,external,paths,onwarn,plugins,treeshake,acorn'.split(',')

function complie(opt, dest, mini) {
  var cfg = {}
  rollupOptions.forEach(function(name) {
    cfg[name] = opt[name]
  })
  cfg.plugins = (opt.plugins || []).concat(mini ? [uglify()] : [])

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
      }),
      code = res.code + '\n//# sourceMappingURL=' + dest.replace(/(.*\/)|(.*\\)/g, '') + '.map',
      mapcode = JSON.stringify(res.map)

    return Promise.all([
      write(dest, code),
      write(dest + '.map', mapcode)
    ])
  })
}

module.exports = function(dest, opt) {
  return complie(opt, dest)
    .then(function(dest) {
      return complie(opt, dest[0].replace(/\.js$/, '.min.js'), true)
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
