var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: {
    syntax: ['./src/Syntax/test/index.js'],
    lexical: ['./src/Lexical/test/lexica_test.js']
  },
  output: {
    filename: '[name].js',
    publicPath: '/',
    path: path.join(__dirname, '/dist'),
    chunkFilename: '[name].[chunkhash].js',
    sourceMapFilename: '[file].[chunkhash].map',
  },

  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.es6', '.json', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['es2015', 'stage-0'],
        },
      },
    ],
  },
  devServer: {
    host: '127.0.0.1',
    port: 8083,
    inline: false,
    hot: false,
  },
};
