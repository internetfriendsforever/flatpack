import path from 'path'
import configPath from './config/path'

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
          loader: 'babel-loader',
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
          loader: 'json-loader'
        }]
      }
    ]
  },

  resolve: {
    alias: {
      config: configPath
    }
  }
}
