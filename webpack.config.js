var path = require('path')
var webpack = require('webpack')


module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    // publicPath: '/dist/',
    filename: 'index.js',
    // library: 'validator',
    libraryTarget: 'umd'
  },
  // resolveLoader: {
  //   root: path.join(__dirname, 'node_modules'),
  // },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        },
        exclude: /node_modules/
      }
    ]
  }
}
