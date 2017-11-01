var webpack = require('webpack');
var path = require('path');                // a useful node path helper library

var config = {
  entry: [
    'webpack/hot/dev-server',
    'webpack-dev-server/client?http://localhost:3000',
    './src/index.js'
  ],
  externals: {
    'cheerio': 'window',
  },
  resolve: {
    // allows you to require without the .js at end of filenames
    // import Component from 'component' vs. import Component from 'component.js'
    extensions: ['.js', '.json', '.jsx']
  },
  output: {
    path: path.resolve(__dirname, 'dist'), // store the bundled output in dist/bundle.js
    filename: 'bundle.js'                  // specifying file name for our compiled assets
  },
  module: {
    loaders: [
      // telling webpack which loaders we want to use.  For now just run the
      // code through the babel-loader.  'babel' is an alias for babel-loader
      { test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/ }
    ]
  }
}

module.exports = config;
