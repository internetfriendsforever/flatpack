const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const getWebpackConfig = require('../getWebpackConfig')
// const fetchRemoteContent = require('../fetchRemoteContent')

const config = getWebpackConfig('development')
const compiler = webpack(config)

module.exports = webpackDevMiddleware(compiler, {
  stats: {
    chunks: false,
    colors: true
  }
})
