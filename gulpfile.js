var gulp = require('gulp'),
  clean = require('gulp-clean'),
  run = require('gulp-run'),
  webpack = require('webpack'),
  runSequence = require('run-sequence'),
  gulpWebpack = require('gulp-webpack'),
  WebpackDevServer = require('webpack-dev-server'),
  karma = require('karma').Server,
  minimist = require('minimist'),
  codecov = require('gulp-codecov'),
  bump = require('gulp-bump'),
  git = require('gulp-git'),
  through = require('through2'),
  dist = './dist',
  pkg = require('./package.json')


function miniConfig(webpackCfg) {
  var miniCfg = Object.assign({}, webpackCfg);
  miniCfg.output = Object.assign({}, webpackCfg.output, {
    filename: webpackCfg.output.filename.replace(/js$/, 'min.js')
  })
  miniCfg.plugins = (miniCfg.plugins || [])
    .concat(new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }));
  delete miniCfg.devtool;
  return miniCfg;
}

function allConfig(webpackCfg) {
  var cfg = Object.assign({}, webpackCfg);
  cfg.output = Object.assign({}, webpackCfg.output, {
    filename: webpackCfg.output.filename.replace(/js$/, 'all.js')
  })
  cfg.externals = {};
  (webpackCfg.allExternals || []).forEach(function(name){
    cfg.externals[name] = webpackCfg.externals[name]
  });
  return cfg;
}

gulp.task('build', ['clean'], function() {
  var webpackCfg = require('./build/webpack.dev.config.js')
  return gulp.src('./')
    .pipe(gulpWebpack(webpackCfg))
    .pipe(gulp.dest(dist))
    .pipe(gulpWebpack(miniConfig(webpackCfg)))
    .pipe(gulp.dest(dist))
    .pipe(gulpWebpack(allConfig(webpackCfg)))
    .pipe(gulp.dest(dist))
    .pipe(gulpWebpack(miniConfig(allConfig(webpackCfg))))
    .pipe(gulp.dest(dist))
});

gulp.task('clean', function() {
  return gulp.src(dist)
    .pipe(clean());
});

gulp.task('watch', function(event) {
  gulp.watch(['./src/**/*.js'], function(event) {
    gulp.start('build');
  });
});

gulp.task('server', function() {
  var webpackCfg = allConfig(require('./build/webpack.dev.config.js'))
  var devServer = new WebpackDevServer(webpack(webpackCfg), {
    contentBase: webpackCfg.output.contentBase,
    publicPath: webpackCfg.output.publicPath,
    hot: false,
    noInfo: false,
    inline: false,
    stats: {
      colors: true
    }
  });
  devServer.listen(webpackCfg.devServer.port, webpackCfg.devServer.host, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log('Listening at port ' + webpackCfg.devServer.port);
    }
  });
});

gulp.task('test', function(done) {
  new karma({
    configFile: __dirname + '/build/karma.unit.config.js'
  }, done).start();
});

gulp.task('cover', function(done) {
  new karma({
    configFile: __dirname + '/build/karma.cover.config.js'
  }, done).start();
});

gulp.task('sauce', function(done) {
  new karma({
    configFile: __dirname + '/build/karma.sauce.config.js'
  }, done).start();
});

gulp.task('cover-ci', ['cover'], function() {
  return gulp.src('./coverage/lcov.info')
    .pipe(codecov());
});

gulp.task('ci', ['cover-ci', 'sauce']);

gulp.task('_commit', function() {
  var args = minimist(process.argv.slice(2));
  return gulp.src('.')
    .pipe(git.add({
      args: '-A'
    }))
    .pipe(git.commit(args.comment));
});

gulp.task('commit', function(callback) {
  runSequence('build', '_commit',
    function(error) {
      if (error)
        console.log(error.message);
      callback(error);
    });
});

gulp.task('_push', function(cb) {
  git.push('origin', 'master', cb);
});

gulp.task('push', function(callback) {
  runSequence('build', '_commit', '_push',
    function(error) {
      if (error)
        console.log(error.message);
      callback(error);
    });
});

gulp.task('publish', function() {
  return run('npm publish').exec();
});

gulp.task('_version', function() {
  var args = minimist(process.argv.slice(2));
  return gulp.src('./package.json')
    .pipe(bump({
      type: args.type || 'patch'
    }))
    .pipe(through.obj(function(file, enc, cb) {
      var oldVer = pkg.version
      pkg.version = JSON.parse(String(file.contents)).version
      console.log('update version: ' + oldVer + ' to ' + pkg.version)
      cb(null, file);
    }))
    .pipe(gulp.dest('./'));
});

/*
  MAJOR ("major") version when you make incompatible API changes
  MINOR ("minor") version when you add functionality in a backwards-compatible manner
  PATCH ("patch") version when you make backwards-compatible bug fixes.
  PRERELEASE ("prerelease") a pre-release version
  Version example
  major: 1.0.0
  minor: 0.1.0
  patch: 0.0.2
  prerelease: 0.0.1-2
 */
gulp.task('version', function(callback) {
  runSequence('_version', 'build', 'publish', '_commit', '_push',
    function(error) {
      if (error)
        console.log(error.message);
      callback(error);
    });
});

gulp.task('tag', function(cb) {
  git.tag(pkg.version, 'Created Tag for version: ' + pkg.version, function(error) {
    if (error)
      return cb(error);
    git.push('origin', 'master', {
      args: '--tags'
    }, cb);
  });
});

gulp.task('release', function(callback) {
  runSequence(
    '_version',
    'build',
    'publish',
    '_commit',
    '_push',
    'tag',
    function(error) {
      if (error)
        console.log(error.message);
      callback(error);
    });
});
