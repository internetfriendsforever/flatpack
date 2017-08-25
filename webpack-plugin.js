const fs = require('fs')
const path = require('path')
const RawSource = require('webpack-sources').RawSource

const manifestPath = 'manifest.json'

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

    const manifest = {
      assets: stats.assets.map(asset => getPublicPath(asset.name)),
      scripts: stats.chunks.map(chunk => getPublicPath(chunk.files[0])),
      asyncModules: {}
    }

    compilation.assets['index.html'] = new RawSource((
      `<html><body>${manifest.scripts.map(script => (
        `<script src="${script}"></script>`
      ))}</body></html>`
    ))

    asyncModuleFilenames.forEach(filename => {
      const name = filename.replace(/\.js$/, '')
      const inputFile = path.join(asyncModulePath, filename)
      const contents = fs.readFileSync(inputFile)
      const source = new RawSource(contents)
      const outputFile = `flatpack-async-modules/${filename}`
      const publicFile = getPublicPath(outputFile)
      compilation.fileDependencies.push(inputFile)
      compilation.assets[outputFile] = source
      manifest.assets.push(publicFile)
      manifest.asyncModules[name] = publicFile
    })

    manifest.assets.push(getPublicPath(manifestPath))
    compilation.assets[manifestPath] = new RawSource(JSON.stringify(manifest))

    callback()
  })
}

module.exports = FlatpackWebpackPlugin
