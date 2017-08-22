const path = require('path')
const FlatpackWebpackPlugin = require('../WebpackPlugin')

module.exports = {
  entry: path.resolve(__dirname, 'index.js'),

  output: {
    path: path.join(__dirname, 'build'),
    filename: 'assets/[name].js',
    publicPath: '/'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [
          path.resolve(__dirname, '../node_modules'),
          path.resolve(__dirname, '../lib')
        ]
      }
    ]
  },

  plugins: [
    new FlatpackWebpackPlugin()
  ]
}
