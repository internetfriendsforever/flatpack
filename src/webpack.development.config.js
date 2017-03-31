import path from 'path'
import webpack from 'webpack'
import commonConfig from './webpack.common.config'

module.exports = {
  ...commonConfig,

  devtool: 'source-map',

  output: {
    path: path.resolve(process.cwd(), 'build'),
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: '/'
  },

  plugins: [
    ...commonConfig.plugins,

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ]
}
