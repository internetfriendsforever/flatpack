const webpack = require('webpack')
const webpackMiddleware = require('webpack-dev-middleware')
const config = require('./config')

module.exports = function (options) {
  const compiler = webpack(config(options))

  return webpackMiddleware(compiler, {
    quiet: true
  })
}
