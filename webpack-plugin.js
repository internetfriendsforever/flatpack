const fs = require('fs')
const path = require('path')
const RawSource = require('webpack-sources').RawSource
const checksum = require('checksum')

const asyncModulePath = path.resolve(__dirname, 'lib/async-modules')
const asyncModuleFilenames = fs.readdirSync(asyncModulePath)

function FlatpackWebpackPlugin (options = {}) {
  this.statsFilename = options.statsFilename || 'stats.json'
}

FlatpackWebpackPlugin.prototype.apply = compiler => {
  compiler.plugin('emit', (compilation, callback) => {
    const publicPath = compiler.options.output.publicPath || ''
    const getPublicPath = name => `${publicPath}${name}`
    const stats = compilation.getStats().toJson()
    const assets = stats.assets.map(asset => getPublicPath(asset.name))
    const scripts = stats.chunks.map(chunk => getPublicPath(chunk.files[0]))

    const manifest = {
      assets: assets,
      scripts: scripts.map(path => assets.indexOf(path)),
      asyncModules: {}
    }

    asyncModuleFilenames.forEach(filename => {
      const name = filename.replace(/\.js$/, '')
      const inputFile = path.join(asyncModulePath, filename)
      const contents = fs.readFileSync(inputFile)
      const sum = checksum(contents)
      const source = new RawSource(contents)
      const outputFile = `async-modules/${filename.replace(/\.js$/, `-${sum}.js`)}`
      const publicFile = getPublicPath(outputFile)
      compilation.fileDependencies.push(inputFile)
      compilation.assets[outputFile] = source
      manifest.assets.push(publicFile)
      manifest.asyncModules[name] = manifest.assets.length - 1
    })

    compilation.assets['index.html'] = new RawSource([
      '<html><body>',
      `<script>window.manifest = ${JSON.stringify(manifest, null, 2)}</script>`,
      ...scripts.map(script => `<script src="${script}"></script>`),
      '</body></html>'
    ].join(''))

    callback()
  })
}

module.exports = FlatpackWebpackPlugin
