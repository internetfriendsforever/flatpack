const path = require('path')
const HtmlPlugin = require('./HtmlPlugin')
const configPath = require('./config/path')

const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

const compiler = webpack({
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
    new HtmlPlugin(require('./render'))
  ],

  resolve: {
    alias: {
      config: configPath
    }
  }
})

const server = new WebpackDevServer(compiler, {
  stats: {
    chunks: false,
    colors: true
  }
})

server.listen(3000)

console.log('Server listening on http://localhost:3000')
