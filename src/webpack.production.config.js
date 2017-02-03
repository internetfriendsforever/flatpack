import path from 'path'
import webpack from 'webpack'

module.exports = {
  ...require('./webpack.common.config'),

  output: {
    path: path.resolve(process.cwd(), 'build'),
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[hash].js'
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.AggressiveMergingPlugin()
  ]
}
