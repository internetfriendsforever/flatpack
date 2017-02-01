const path = require('path')
const FileWriterWebpackPlugin = require('./FileWriterWebpackPlugin')
const configPath = require('./config/path')

module.exports = {
  entry: path.resolve(__dirname, 'client.js'),

  output: {
    path: path.resolve(process.cwd(), 'build'),
    filename: 'client.js'
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: require.resolve('babel-loader'),
        exclude: /node_modules/,
        query: require('./babel')
      }
    ]
  },

  plugins: [
    new FileWriterWebpackPlugin(require('./render'))
  ],

  resolve: {
    alias: {
      config: configPath
    }
  }
}
