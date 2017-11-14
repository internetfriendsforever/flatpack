const path = require('path')
const fs = require('fs')
const zipObject = require('lodash/zipObject')
const MinifyPlugin = require('babel-minify-webpack-plugin')

const asyncModulePath = './src/async-modules'
const asyncModuleFilenames = fs.readdirSync(asyncModulePath)

const asyncModuleEntries = zipObject(
  asyncModuleFilenames.map(filename => filename.replace(/\.js$/, '')),
  asyncModuleFilenames.map(filename => [path.resolve(asyncModulePath, filename)])
)

module.exports = [
  {
    entry: {
      'flatpack': './src/flatpack.js'
    },

    output: {
      path: path.join(__dirname, 'lib'),
      filename: '[name].js',
      library: '[name]',
      libraryTarget: 'umd',
      libraryExport: 'default',
      umdNamedDefine: true
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        }
      ]
    },

    plugins: [
      new MinifyPlugin()
    ]
  },

  {
    entry: asyncModuleEntries,

    output: {
      path: path.join(__dirname, 'lib'),
      filename: 'async-modules/[name].js',
      library: ['asyncModule', '[name]'],
      libraryTarget: 'umd',
      libraryExport: 'default'
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        }
      ]
    },

    plugins: [
      new MinifyPlugin()
    ]
  }
]
