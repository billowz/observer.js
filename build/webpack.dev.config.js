var path = require('path'),
  webpack = require('webpack'),
  pkg = require('../package.json'),
  bannar = `${pkg.name} v${pkg.version} built in ${new Date().toUTCString()}
Copyright (c) 2016 ${pkg.author}
Released under the ${pkg.license} license
support IE6+ and other browsers
support ES6 Proxy and Object.observe
${pkg.homepage}`;

var devServer = {
  host: 'localhost',
  port: 8088
};

var config = {
  devServer: devServer,
  entry: {
    observer: path.resolve(__dirname, '../src/index.js')
  },
  output: {
    publicPath: `http://${devServer.host}:${devServer.port}/dist/`,
    contentBase: path.resolve(__dirname, '../'),
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js',
    library: '[name]',
    libraryTarget: 'umd'
  },
  externals: {
    utility: {
      root: 'utility',
      commonjs: 'utility',
      commonjs2: 'utility',
      amd: 'utility'
    }
  },
  resolve: {
    modulesDirectories: [path.resolve(__dirname, '../node_modules')],
    extensions: ['', '.js'],
    alias: {
      'utility': 'utility.js'
    }
  },
  module: {
    loaders: [{
      test: /\.(js)$/,
      loader: 'babel'
    }]
  },
  plugins: [new webpack.BannerPlugin(bannar)]
}

module.exports = config;
