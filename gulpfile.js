var gulp = require('gulp'),
  clean = require('gulp-clean'),
  run = require('gulp-run'),
  webpack = require('webpack'),
  runSequence = require('run-sequence'),
  gulpWebpack = require('gulp-webpack'),
  WebpackDevServer = require('webpack-dev-server'),
  karma = require('karma').Server,
  webpackCfg = require('./build/webpack.dev.config.js'),
  minimist = require('minimist'),
  codecov = require('gulp-codecov'),
  bump = require('gulp-bump'),
  git = require('gulp-git'),
  pkg = require('./package.json'),
  dist = './dist'

gulp.task('build', ['clean'], function() {
  var miniCfg = Object.assign({}, webpackCfg);
  miniCfg.output = Object.assign({}, webpackCfg.output)
  miniCfg.output.filename = miniCfg.output.filename.replace(/js$/, 'min.js')
  miniCfg.plugins = (miniCfg.plugins || [])
    .concat(new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }));
  webpackCfg.devtool = 'source-map'
  return gulp.src('./')
    .pipe(gulpWebpack(webpackCfg))
    .pipe(gulp.dest(dist))
    .pipe(gulpWebpack(miniCfg))
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
  webpackCfg.devtool = 'source-map'
  var devServer = new WebpackDevServer(webpack(webpackCfg));
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

gulp.task('_version', function() {
  var args = minimist(process.argv.slice(2));
  return gulp.src('./package.json')
    .pipe(bump({
      type: args.type || 'patch'
    }).on('error', function(err) {
      console.log(err)
    }))
    .pipe(gulp.dest('./'))
    .pipe(run('npm publish'));
});

gulp.task('version', function(callback) {
  runSequence('build', '_version', '_commit', '_push',
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
    'build',
    '_version',
    '_commit',
    '_push',
    'tag',
    function(error) {
      if (error)
        console.log(error.message);
      callback(error);
    });
});
