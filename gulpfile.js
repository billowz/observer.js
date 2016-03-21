var gulp = require('gulp'),
  clean = require('gulp-clean'),
  webpack = require('webpack'),
  gulpWebpack = require('gulp-webpack'),
  WebpackDevServer = require('webpack-dev-server'),
  karma = require('karma').Server,
  webpackCfg = require('./build/webpack.dev.config.js'),
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
