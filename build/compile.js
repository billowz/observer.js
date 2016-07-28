var fs = require('fs'),
  zlib = require('zlib'),
  rollup = require('rollup').rollup,
  uglify = require('uglify-js'),
  babel = require('./rollup-babel')

module.exports = function(opt) {
  return rollup({
      entry: opt.entry,
      plugins: [babel()].concat(opt.plugins || [])
    })
    .then(function(bundle) {
      return write(opt.dest, bundle.generate({
        format: 'umd',
        banner: opt.banner,
        moduleId: opt.module,
        moduleName: opt.module,
        useStrict: opt.useStrict,
      }).code)
    })
    .then(function(dest) {
      return write(dest.replace(/\.js$/, '.min.js'), uglify.minify(dest).code)
    })
    .then(function(dest) {
      return new Promise(function(resolve, reject) {
        fs.readFile(dest, function(err, buf) {
          if (err) return reject(err)
          zlib.gzip(buf, function(err, buf) {
            if (err) return reject(err)
            write(dest.replace(/\.js$/, '.js.gz'), buf).then(resolve).catch(reject)
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
      console.log(dest + ' ' + size(code))
      resolve(dest)
    })
  })
}

function size(code) {
  return (code.length / 1024).toFixed(2) + 'kb'
}
