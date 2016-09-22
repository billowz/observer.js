var express = require('express'),
  fs = require('fs'),
  path = require('path'),
  compile = require('./compile')


function devServer(options) {
  var app = express(),
    compileResult,
    fileMap = {},
    watchs = {},
    isBuilding = false

  function build(processor) {
    if (isBuilding)
      return;

    isBuilding = true
    processor((err) => {
      if (err) {
        console.error('build error', err)
      } else {
        console.error('build success at ' + new Date())
      }
      isBuilding = false
    })
  }

  function addContent(map, path, content) {
    if (path) {
      map[path[0] === '/' ? path : '/' + path] = content
      console.log('apply file:' + path + ' (' + size(content) + ')')
    }
  }

  function rollup(done) {
    console.log('rollup compile...')
    compile.compile(options).then((rs) => {
      var bundle = rs.bundle,
        main = rs.main,
        mini = rs.mini,
        gzip = rs.gzip,
        map = {},
        _watchs = {}

      options.rollup.cache = bundle

      bundle.modules.forEach(m => {
        var file = m.id

        if (path.isAbsolute(file)) {
          var w = watchs[file]
          if (!w) {
            console.log('watch file: ' + file)
            w = fs.watch(file, (type) => {
              console.log('file %s: %s', type, file)
              build(rollup)
            })
          }
          _watchs[file] = w
        }
      })
      for (var _path in watchs) {
        if (!_watchs[_path]) {
          console.log('unwatch file: ' + _path)
          watchs[_path].close()
        }
      }
      watchs = _watchs

      compileResult = rs

      addContent(map, main.dest, main.code)
      if (main.sourcemap)
        addContent(map, main.sourcemapDest, JSON.stringify(main.sourcemap))
      if (mini) {
        addContent(map, mini.dest, mini.code)
        if (mini.sourcemap)
          addContent(map, mini.sourcemapDest, JSON.stringify(mini.sourcemap))
        if (gzip)
          addContent(map, gzip.dest, gzip.code)
      }
      fileMap = map
      done()
    }).catch(e => {
      done(e)
    })
  }

  build(rollup)

  app.use(function(req, res, next) {
    var content = fileMap[req.path]
    if (content) {
      res.send(content)
    } else {
      next()
    }
  })
  if (options.base)
    app.use(express.static(options.base))
  app.listen(options.port)
  console.log('listen localhost:' + options.port)
  return app
}

function size(buf) {
  return (buf.length / 1024).toFixed(2) + 'kb'
}


devServer(Object.assign({}, require('./rollup.all.config'), {
  base: path.join(__dirname, '../'),
  port: 3000
}))
