const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const FlatpackPlugin = require('../../../../webpack-plugin')

module.exports = function ({ port }) {
  const projectBabelConfigPath = path.resolve(process.cwd(), '.babelrc')
  const babelOptions = {}

  if (fs.existsSync(projectBabelConfigPath)) {
    babelOptions.babelrc = projectBabelConfigPath
  } else {
    babelOptions.presets = [
      require.resolve('babel-preset-env'),
      require.resolve('babel-preset-react')
    ]
  }

  return {
    entry: path.resolve(process.cwd(), 'index.js'),

    output: {
      filename: '[name]-[hash].js',
      path: path.resolve(process.cwd(), '.flatpack'),
      publicPath: '/'
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
          messages: [
            '✨ Open ' + chalk.underline(chalk.bold('http://localhost:' + port)) + ' to view website'
          ]
        }
      })
    ],

    resolve: {
      modules: [
        path.resolve(process.cwd(), 'node_modules'),
        path.resolve(__dirname, '../../node_modules')
      ]
    },

    devServer: {
      quiet: true,
      historyApiFallback: true
    }
  }
}
