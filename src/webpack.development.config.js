import path from 'path'
import webpack from 'webpack'
// import FileWriterWebpackPlugin from './FileWriterWebpackPlugin'
// import getAssetsFromCompilation from './getAssetsFromCompilation'
// import fetchRemoteContent from'./fetchRemoteContent'
// import renderRoutes from './renderRoutes'
// import getConfig from './config/get'
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

    // new FileWriterWebpackPlugin((compilation, callback) => {
    //   const assets = getAssetsFromCompilation(compilation)
    //   const scripts = [assets.client]
    //
    //   // Clear require cache
    //   Object.keys(require.cache).forEach(key => {
    //     if (!/node_modules/.test(key)) {
    //       delete require.cache[key]
    //     }
    //   })
    //
    //   getConfig((err, config) => {
    //     if (err) {
    //       return callback(err)
    //     }
    //
    //     fetchRemoteContent((err, content) => {
    //       if (err) {
    //         return callback(err)
    //       }
    //
    //       renderRoutes({ config, content, scripts }, (err, files) => {
    //         if (err) {
    //           return callback(err)
    //         }
    //
    //         callback(null, files)
    //       })
    //     })
    //   })
    // })
  ]
}
