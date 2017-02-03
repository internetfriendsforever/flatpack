export default function getAssetsFromCompilation (compilation) {
  const stats = compilation.getStats().toJson()

  const assets = {}

  for (var chunk in stats.assetsByChunkName) {
    let chunkValue = stats.assetsByChunkName[chunk]

    // Webpack outputs an array for each chunk when using sourcemaps
    if (chunkValue instanceof Array) {
      // Is the main bundle always the first element?
      chunkValue = chunkValue[0]
    }

    if (compilation.options.output.publicPath) {
      chunkValue = compilation.options.output.publicPath + chunkValue
    }
    assets[chunk] = chunkValue
  }

  return assets
}
