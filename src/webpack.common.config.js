import path from 'path'
import webpack from 'webpack'
import configPath from './config/path'
import awsConfig from './config/aws'

process.env.AWS_SERVICES = 's3,cognitoidentity,cognitoidentityserviceprovider,cloudfront'

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
      },

      {
        test: /aws-sdk/,
        use: [{
          loader: require.resolve('transform-loader'),
          options: 'aws-sdk/dist-tools/transform'
        }]
      },

      {
        test: /\.jsx?$/,
        include: /amazon-cognito-identity-js/,
        use: [{
          loader: require.resolve('babel-loader')
        }]
      },

      {
        test: /\.json$/,
        use: [{
          loader: require.resolve('json-loader')
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
