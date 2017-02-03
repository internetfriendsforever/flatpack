require('babel-register')(require('./defaultBabelConfig'))

import path from 'path'
import FileWriterWebpackPlugin from './FileWriterWebpackPlugin'
import getAssetsFromCompilation from './getAssetsFromCompilation'
import fetchRemoteContent from'./fetchRemoteContent'
import renderRoutes from './renderRoutes'
import configPath from './config/path'
import configDefaults from'./config/defaults'

// TODO: Get content from somewhere
// const content = {
//   books: [
//     { id: 1, title: 'Book one' },
//     { id: 2, title: 'Book two' }
//   ]
// }

process.env.AWS_SERVICES = 's3,cognitoidentity,cognitoidentityserviceprovider,cloudfront'

module.exports = {
  entry: {
    client: path.resolve(__dirname, 'client.js')
  },

  output: {
    path: path.resolve(process.cwd(), 'build'),
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[hash].js'
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: require.resolve('babel-loader'),
        exclude: /node_modules/,
        query: require('./defaultBabelConfig')
      },

      {
        test: /aws-sdk/,
        loader: require.resolve('transform-loader'),
        query: 'aws-sdk/dist-tools/transform'
      },

      {
        test: /\.jsx?$/,
        include: /amazon-cognito-identity-js/,
        loader: require.resolve('babel-loader')
      },

      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
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
  ],

  resolve: {
    alias: {
      config: configPath
    }
  }
}
