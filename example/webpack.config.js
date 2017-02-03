module.exports = {
  module: {
    loaders: [
      {
        test: /\.png$/,
        loader: 'file-loader?name=[name].[ext]'
      }
    ]
  }
}
