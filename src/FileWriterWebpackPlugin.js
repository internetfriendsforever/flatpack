/*
Usage:
new FileWriterWebpackPlugin(compilation, callback => callback(null, {
  'write-this-file.html': '<html></html>'
}))
*/

const RawSource = require('webpack-sources/lib/RawSource')

const FileWriterWebpackPlugin = function (getFiles, callback) {
  this.getFiles = getFiles
}

FileWriterWebpackPlugin.prototype.apply = function (compiler) {
  compiler.plugin('this-compilation', compilation => {
    compilation.plugin('optimize-assets', (_, done) => {
      this.getFiles(compilation, (err, files) => {
        if (err) {
          console.log(err)
          compilation.errors.push(err)
        } else {
          Object.keys(files).forEach(filename => {
            compilation.assets[filename] = new RawSource(files[filename])
          })
        }

        done()
      })
    })
  })
}

module.exports = FileWriterWebpackPlugin
