import path from 'path'
import webpack from 'webpack'
import configPath from './config/path'
import awsConfig from './config/aws'

process.noDeprecation = true

module.exports = {
  entry: {
    client: path.resolve(__dirname, 'client.js')
  },

  output: {
    path: path.resolve(process.cwd(), '.flatpack'),
    filename: '[name].js',
    chunkFilename: '[name].js'
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [{
          loader: require.resolve('babel-loader'),
          options: {
            presets: [
              require.resolve('babel-preset-es2015'),
              require.resolve('babel-preset-react')
            ]
          }
        }]
      }
    ]
  },

  resolve: {
    modules: [
      path.resolve(process.cwd(), 'node_modules'),
      path.resolve(__dirname, '..', 'node_modules')
    ],
    alias: {
      config: configPath
    }
  },

  plugins: [
    new webpack.DefinePlugin({
      'window.aws': JSON.stringify(awsConfig)
    })
  ]
}
