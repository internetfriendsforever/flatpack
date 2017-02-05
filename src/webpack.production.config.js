import path from 'path'
import webpack from 'webpack'
import commonConfig from './webpack.common.config.js'

module.exports = {
  ...commonConfig,

  output: {
    path: path.resolve(process.cwd(), 'build'),
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[hash].js',
    publicPath: '/'
  },

  plugins: [
    ...commonConfig.plugins,

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.AggressiveMergingPlugin()
  ]
}
