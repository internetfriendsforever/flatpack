require('babel-register')(require('./defaultBabelConfig'))

import path from 'path'
import React from 'react'
import Provider from './components/provider'
import FileWriterWebpackPlugin from './FileWriterWebpackPlugin'
import { renderToStaticMarkup } from 'react-dom/server'
import fetchRemoteContent from'./fetchRemoteContent'
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

function renderWithProvider (component, config, content) {
  return renderToStaticMarkup(
    <Provider content={content} config={config} assets={{}}>
      {component}
    </Provider>
  )
}

module.exports = {
  entry: {
    client: path.resolve(__dirname, 'client.js')
  },

  output: {
    path: path.resolve(process.cwd(), 'build'),
    filename: '[name].js',
    chunkFilename: '[name].js'
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
    new FileWriterWebpackPlugin(callback => {
      // Clear require cache
      Object.keys(require.cache).forEach(key => {
        if (!/node_modules/.test(key)) {
          delete require.cache[key]
        }
      })

      const projectConfig = require(configPath)
      const config = configDefaults(projectConfig)

      fetchRemoteContent(config.aws, content => {
        const routes = config.routes(content)
        const template = config.template

        const files = {}

        // Route files
        routes.forEach(route => {
          const filepath = path.join(route.path, '/index.html').replace(/^\//, '')
          const html = renderWithProvider(route.component, config, content)
          files[filepath] = template(html, content)
        })

        // 404 file
        if (config.notFoundRoute) {
          const html = renderWithProvider(config.notFoundRoute, config, content)
          files['404.html'] = template(html, content)
        }

        callback(files)
      })
    })
  ],

  resolve: {
    alias: {
      config: configPath
    }
  }
}
