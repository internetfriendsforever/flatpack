const MemoryFS = require('memory-fs')
const webpack = require('webpack')
const requireFromString = require('require-from-string')
const configPath = require('./path')
const configDefaults = require('./defaults')
const getWebpackConfig = require('../getWebpackConfig')

const fs = new MemoryFS()

const config = getWebpackConfig('common')

config.output.libraryTarget = 'commonjs'

config.entry = {
  config: configPath
}

const compiler = webpack(config)

compiler.outputFileSystem = fs

module.exports = callback => {
  console.log('Compiling project main...')

  compiler.run((err, stats) => {
    if (err) {
      console.log(err)
    }

    console.log('Done compiling project main...')

    const filename = stats.toJson().assetsByChunkName.config
    const path = `${config.output.path}/${filename}`
    const data = fs.readFileSync(path, 'utf-8')

    const projectConfig = configDefaults(requireFromString(data).default)

    callback(projectConfig)
  })
}
