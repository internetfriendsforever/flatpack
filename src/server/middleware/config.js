const webpack = require('webpack')
const chalk = require('chalk')
const cloneDeep = require('lodash').cloneDeep
const requireFromString = require('require-from-string')
const MemoryFS = require('memory-fs')
const configPath = require('../../config/path')
const configDefaults = require('../../config/defaults')
const getWebpackConfig = require('../../getWebpackConfig')
const webpackBuilder = require('./webpackBuilder')

const fs = new MemoryFS()
const webpackConfig = cloneDeep(getWebpackConfig('common'))

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

compiler.outputFileSystem = fs

function logError (error) {
  chalk.red('✘ Build error!')
  console.log(error.message)
}

const builder = webpackBuilder(compiler, 'config')

const transformer = (req, res, next) => {
  const filename = res.locals.webpack.config.stats.toJson().assetsByChunkName.config
  const configPath = `${webpackConfig.output.path}/${filename}`

  if (fs.existsSync(configPath)) {
    fs.readFile(configPath, 'utf-8', (err, data) => {
      if (err) {
        logError(err)
      }

      try {
        const getConfig = requireFromString(data).default
        res.locals.config = configDefaults(getConfig)
        next()
      } catch (e) {
        logError(e)
      }
    })
  } else {
    logError(new Error(`Could not read ${configPath} from MemoryFS filesystem`))
  }
}

module.exports = [builder, transformer]
