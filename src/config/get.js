const path = require('path')
// const fs = require('fs')
const MemoryFS = require('memory-fs')
const requireFromString = require('require-from-string')
const webpack = require('webpack')
const configPath = require('./path')
const configDefaults = require('./defaults')
const getWebpackConfig = require('../getWebpackConfig')

module.exports = callback => {
  console.log('Compiling project main...')

  const webpackConfig = Object.assign({}, getWebpackConfig('common'))

  webpackConfig.target = 'node'
  webpackConfig.output.libraryTarget = 'commonjs'

  webpackConfig.entry = {
    config: configPath
  }

  if (!webpackConfig.resolve) {
    webpackConfig.resolve = {}
  }

  webpackConfig.resolve.aliasFields = ['server']
  webpackConfig.resolve.mainFields = ['module', 'main']

  const compiler = webpack(webpackConfig)

  const fs = new MemoryFS()

  compiler.outputFileSystem = fs

  compiler.run((err, stats) => {
    if (err) {
      callback(err)
    }

    if (stats.hasErrors()) {
      callback(new Error(stats.toString()))
    }

    console.log('Done compiling project main...')

    const filename = stats.toJson().assetsByChunkName.config
    const configPath = `${webpackConfig.output.path}/${filename}`

    if (fs.existsSync(configPath)) {
      fs.readFile(configPath, 'utf-8', (err, data) => {
        if (err) {
          callback(err)
        }

        try {
          const getConfig = requireFromString(data).default
          const config = configDefaults(getConfig)
          callback(null, config)
        } catch (e) {
          callback(e)
        }
      })
    } else {
      callback(new Error(`Could not read ${path} from MemoryFS filesystem`))
    }
  })
}
