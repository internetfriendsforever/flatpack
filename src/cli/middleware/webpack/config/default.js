const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const FlatpackPlugin = require('../../../../../webpack-plugin')

module.exports = function ({ port }) {
  const projectBabelConfigPath = path.resolve(process.cwd(), '.babelrc')
  const babelOptions = {}

  if (fs.existsSync(projectBabelConfigPath)) {
    babelOptions.babelrc = projectBabelConfigPath
  } else {
    babelOptions.presets = [
      require.resolve('babel-preset-es2015'),
      require.resolve('babel-preset-react')
    ]
  }

  return {
    entry: path.resolve(process.cwd(), 'index.js'),

    output: {
      path: path.resolve(process.cwd(), '.flatpack')
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [{
            loader: require.resolve('babel-loader'),
            options: babelOptions
          }]
        }
      ]
    },

    plugins: [
      new FlatpackPlugin(),
      new FriendlyErrorsWebpackPlugin({
        compilationSuccessInfo: {
          messages: ['✨ Open ' + chalk.underline(chalk.bold('http://localhost:' + port)) + ' to view website']
        }
      })
    ],

    resolve: {
      modules: [
        path.resolve(process.cwd(), 'node_modules'),
        path.resolve(__dirname, '../../node_modules')
      ]
    }
  }
}
