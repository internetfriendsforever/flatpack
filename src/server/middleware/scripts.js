const webpack = require('webpack')
const webpackBuilder = require('./webpackBuilder')
const getWebpackConfig = require('../../getWebpackConfig')

const config = getWebpackConfig('development')
const compiler = webpack(config)

module.exports = webpackBuilder(compiler, 'scripts')
