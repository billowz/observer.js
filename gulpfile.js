var gulp = require('gulp'),
  clean = require('gulp-clean'),
  webpack = require('webpack'),
  runSequence = require('run-sequence'),
  gulpWebpack = require('gulp-webpack'),
  WebpackDevServer = require('webpack-dev-server'),
  karma = require('karma').Server,
  webpackCfg = require('./build/webpack.dev.config.js'),
  minimist = require('minimist'),
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



gulp.task('commit', function() {
  var args = minimist(process.argv.slice(2));
  console.log(args.comment)
  return gulp.src('.')
    .pipe(git.commit(args.comment, {
      args: '-a'
    }));
});

gulp.task('push', function(cb) {
  git.push('origin', 'master', cb);
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

gulp.task('version', function() {
  var args = minimist(process.argv.slice(2));
  return gulp.src('./package.json')
    .pipe(bump({
      type: args.type || 'patch'
    }).on('error', function(err) {
      console.log(err)
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('release', function(callback) {
  runSequence(
    'version',
    'commit',
    'push',
    'tag',
    function(error) {
      if (error) {
        console.log(error.message);
      } else {
        console.log('RELEASE FINISHED SUCCESSFULLY');
      }
      callback(error);
    });
});
