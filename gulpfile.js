var fs = require('fs'),
  path = require('path'),
  gulp = require('gulp'),
  clean = require('gulp-clean'),
  webpack = require('webpack'),
  gulpWebpack = require('gulp-webpack'),
  WebpackDevServer = require('webpack-dev-server'),
  mkcfg = require('./tool/make.webpack.js'),
  main = {
    src: './src',
    dist: './dist',
    entry: 'index.js',
    library: 'observer',
    output: 'observer.js',
    moduleDirectories: ['dependency'],
    externals: [{
      path: 'lodash',
      root: '_',
      lib: '_'
    }]
  },
  devserver = {
    host: 'localhost',
    port: 8088
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

gulp.task('build', ['clean'], function() {
  return _buildCompontent(main, true);
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
  cfg.entry = cfg.src + '/' + cfg.entry;
  cfg.publicPath = 'http://' + devserver.host + ':' + devserver.port + main.dist.replace(/^\.\//, '/');
  cfg.hot = true;
  cfg.devtool = 'source-map',
  cfg.plugins = (cfg.plugins || []).push(new webpack.NoErrorsPlugin());
  cfg.output = path.join(__dirname, cfg.output);
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
