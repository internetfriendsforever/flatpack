const path = require('path')
const MemoryFS = require('memory-fs')
const webpack = require('webpack')
const requireFromString = require('require-from-string')
const configPath = require('./path')
const configDefaults = require('./defaults')
const getWebpackConfig = require('../getWebpackConfig')

module.exports = callback => {
  console.log('Compiling project main...')

  const fs = new MemoryFS()

  const webpackConfig = Object.assign({}, getWebpackConfig('common'))

  webpackConfig.target = 'node'
  webpackConfig.output.libraryTarget = 'commonjs'

  webpackConfig.entry = {
    config: configPath
  }

  const compiler = webpack(webpackConfig)

  compiler.outputFileSystem = fs

  compiler.run((err, stats) => {
    if (err) {
      throw err
    }

    if (stats.hasErrors()) {
      throw new Error(stats.toString())
    }

    console.log('Done compiling project main...')

    const filename = stats.toJson().assetsByChunkName.config
    const configPath = `${webpackConfig.output.path}/${filename}`

    if (fs.existsSync(configPath)) {
      fs.readFile(configPath, 'utf-8', (err, data) => {
        if (err) {
          throw err
        } else {
          const getConfig = requireFromString(data).default
          const config = configDefaults(getConfig)
          callback(config)
        }
      })
    } else {
      throw new Error(`Could not read ${path} from MemoryFS filesystem`)
    }
  })
}
