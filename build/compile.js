var fs = require('fs'),
  zlib = require('zlib'),
  rollup = require('rollup').rollup,
  uglify = require('rollup-plugin-uglify'),
  pkg = require('../package.json')

function parseBundleGenerated(generated, dest, sourceMap) {
  var result = {
      dest: dest
    },
    code = generated.code

  if (sourceMap) {
    var sourcemap = generated.map,
      sourcemapDest = dest + '.map'

    sourcemap.sources = sourcemap.sources.map((path) => {
      var _path = path.replace(/(^node_modules|\/node_modules)\//, '/')
      return _path === path ? path.replace(/\/src\//, `/${pkg.name}/src/`) : _path
    })
    if (sourceMap === 'inline') {
      code += '\n//# sourceMappingURL=' + sourcemap.toUrl()
    } else {
      code += '\n//# sourceMappingURL=' + sourcemapDest.replace(/(.*\/)|(.*\\)/g, '')
      result.sourcemap = sourcemap
      result.sourcemapDest = sourcemapDest
    }
  }
  result.code = code
  return result
}

function compile(options) {
  var rollupConfig = options.rollup,
    bundleConfig = options.bundle

  console.log('compile %s', bundleConfig.dest)

  return rollup(rollupConfig)
    .then(bundle => {
      var main = parseBundleGenerated(bundle.generate(bundleConfig), bundleConfig.dest, bundleConfig.sourceMap)
      return new Promise((resolve, reject) => {
        if (bundleConfig.mini) {

          console.log('compile mini %s', bundleConfig.dest.replace(/\.js$/, '.min.js'))

          rollup(Object.assign({}, rollupConfig, {
            plugins: rollupConfig.plugins.concat([uglify()])
          })).then(miniBundle => {
            var miniDest = bundleConfig.dest.replace(/\.js$/, '.min.js'),
              mini = parseBundleGenerated(miniBundle.generate(bundleConfig), miniDest, bundleConfig.sourceMap)

            if (bundleConfig.gzip) {
              console.log('compile gzip %s', miniDest + '.gz')
              zlib.gzip(mini.code, (err, content) => {
                if (err) return reject(err)
                resolve({
                  bundle: bundle,
                  main: main,
                  mini: mini,
                  gzip: {
                    code: content,
                    dest: miniDest + '.gz'
                  }
                })
              })
            } else {
              resolve({
                bundle: bundle,
                main: main,
                mini: mini
              })
            }
          }).catch(e => {
            reject(e)
          })
        } else {
          resolve({
            bundle: bundle,
            main: main
          })
        }
      })
    })
}

function index(options) {
  return compile(options).then((rs) => {
    var main = rs.main,
      mini = rs.mini,
      gzip = rs.gzip

    write(main.dest, main.code, writeLog)
    if (main.sourcemap)
      write(main.sourcemapDest, JSON.stringify(main.sourcemap), writeLog)
    if (mini) {
      write(mini.dest, mini.code, writeLog)
      if (mini.sourcemap)
        write(mini.sourcemapDest, JSON.stringify(mini.sourcemap), writeLog)
      if (gzip)
        write(gzip.dest, gzip.code, writeLog)
    }
  }).catch(e => {
    console.error(e)
  })
}

index.compile = compile
module.exports = index

function write(dest, buf, callback) {
  return new Promise((resolve, reject) => {
    fs.writeFile(dest, buf, (err) => {
      if (err) return reject(err)
      callback(dest, buf)
      resolve(dest)
    })
  })
}

function writeLog(dest, buf) {
  console.log('output: ' + dest + ' (' + size(buf) + ')')
}

function size(buf) {
  return (buf.length / 1024).toFixed(2) + 'kb'
}
