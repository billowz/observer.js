var fs = require('fs'),
  path = require('path'),
  gulp = require('gulp'),
  clean = require('gulp-clean'),
  webpack = require('webpack'),
  gulpWebpack = require('gulp-webpack'),
  WebpackDevServer = require('webpack-dev-server'),
  mkcfg = require('./build/make.webpack.js'),
  pkg = require('./package.json'),
  karma = require('karma').Server,
  main = {
    src: './src',
    dist: './dist',
    entry: 'index.js',
    library: 'observer',
    output: 'observer.js',
    moduleDirectories: ['node_modules'],
    plugins: [new webpack.BannerPlugin(`${pkg.name} v${pkg.version} built in ${new Date().toUTCString()}
Copyright (c) 2016 ${pkg.author}
Released under the ${pkg.license} license
support IE6+ and other browsers
support ES6 Proxy and Object.observe
${pkg.homepage}`)]
  },
  devserver = {
    host: '0.0.0.0',
    port: 8089
  };

function _buildCompontent(config, rebuild) {
  var output = path.join(__dirname, config.dist, config.output);
  if (!rebuild && fs.existsSync(output)) {
    return;
  }
  var cfg = Object.create(config),
    miniCfg = Object.create(config);
  cfg.entry = miniCfg.entry = config.src + '/' + config.entry;
  cfg.output = miniCfg.output = output;
  cfg.devtool = 'source-map';
  miniCfg.output = miniCfg.output.replace(/js$/, 'min.js');
  miniCfg.plugins = (miniCfg.plugins || []).concat(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  }));
  return gulp.src(config.src)
    .pipe(gulpWebpack(mkcfg(cfg)))
    .pipe(gulp.dest(config.dist))
    .pipe(gulpWebpack(mkcfg(miniCfg)))
    .pipe(gulp.dest(config.dist));
}

gulp.task('build:lib', function() {
  return _buildCompontent(main, true);
});
gulp.task('build', ['clean'], function() {
  return gulp.start(['build:lib']);
});

gulp.task('clean', function() {
  return gulp.src(main.dist)
    .pipe(clean());
});

gulp.task('watch', function(event) {
  gulp.watch([main.src + '/**/*.js'], function(event) {
    gulp.start('build');
  });
});

gulp.task('server', ['build'], function() {
  var cfg = Object.create(main);
  cfg.entry = {};
  cfg.entry[main.output] = main.src + '/' + main.entry;
  cfg.publicPath = 'http://' + devserver.host + ':' + devserver.port + main.dist.replace(/^\.\//, '/');
  cfg.hot = true;
  cfg.devtool = 'source-map',
  cfg.plugins = (main.plugins || []).push(new webpack.NoErrorsPlugin());
  cfg.output = path.join(__dirname, '[name]');
  var devServer = new WebpackDevServer(webpack(mkcfg(cfg)), {
    contentBase: path.join('./'),
    publicPath: cfg.publicPath,
    hot: true,
    noInfo: false,
    inline: true,
    stats: {
      colors: true
    }
  });
  devServer.listen(devserver.port, devserver.host, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log('Listening at port ' + devserver.port);
    }
  });
});

gulp.task('test', function(done) {
  new karma({
    configFile: __dirname + '/build/karma.unit.config.js'
  }).start();
});
gulp.task('cover', function(done) {
  new karma({
    configFile: __dirname + '/build/karma.cover.config.js'
  }).start();
});

gulp.task('sauce', function(done) {
  new karma({
    configFile: __dirname + '/build/karma.sauce.config.js'
  }).start();
});

gulp.task('ci', 'cover', 'sauce')
