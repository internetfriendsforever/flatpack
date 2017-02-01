const RawSource = require('webpack-sources/lib/RawSource')

const FileWriterWebpackPlugin = function (getFiles) {
  this.getFiles = getFiles
}

FileWriterWebpackPlugin.prototype.apply = function (compiler) {
  compiler.plugin('this-compilation', compilation => {
    compilation.plugin('optimize-assets', (_, done) => {
      const files = this.getFiles()

      Object.keys(files).forEach(filename => {
        compilation.assets[filename] = new RawSource(files[filename])
      })

      done()
    })
  })
}

module.exports = FileWriterWebpackPlugin
