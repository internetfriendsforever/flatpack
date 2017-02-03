require('babel-register')(require('./defaultBabelConfig'))

import path from 'path'
import FileWriterWebpackPlugin from './FileWriterWebpackPlugin'
import getAssetsFromCompilation from './getAssetsFromCompilation'
import fetchRemoteContent from'./fetchRemoteContent'
import renderRoutes from './renderRoutes'
import configPath from './config/path'
import configDefaults from'./config/defaults'

module.exports = {
  ...require('./webpack.config.js'),

  devtool: 'source-map',

  output: {
    path: path.resolve(process.cwd(), 'build'),
    filename: '[name].js',
    chunkFilename: '[name].js'
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

      const projectConfig = require(configPath)
      const config = configDefaults(projectConfig)

      fetchRemoteContent(config.aws, content => {
        callback(renderRoutes(config, content, scripts))
      })
    })
  ]
}
