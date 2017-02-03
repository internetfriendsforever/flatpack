import path from 'path'
import configPath from './config/path'

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
        query: {
          presets: [
            require.resolve('babel-preset-es2015'),
            require.resolve('babel-preset-react')
          ]
        }
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

  resolve: {
    alias: {
      config: configPath
    }
  }
}
