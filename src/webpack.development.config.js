import path from 'path'
import FileWriterWebpackPlugin from './FileWriterWebpackPlugin'
import getAssetsFromCompilation from './getAssetsFromCompilation'
import fetchRemoteContent from'./fetchRemoteContent'
import renderRoutes from './renderRoutes'
import getConfig from './config/get'

module.exports = {
  ...require('./webpack.common.config'),

  devtool: 'source-map',

  output: {
    path: path.resolve(process.cwd(), 'build'),
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: '/'
  },

  plugins: [
    new FileWriterWebpackPlugin((compilation, callback) => {
      const assets = getAssetsFromCompilation(compilation)
      const scripts = [assets.client]

      // Clear require cache
      Object.keys(require.cache).forEach(key => {
        if (!/node_modules/.test(key)) {
          delete require.cache[key]
        }
      })

      getConfig(config => {
        fetchRemoteContent(config.aws, content => {
          callback(renderRoutes(config, content, scripts))
        })
      })
    })
  ]
}
