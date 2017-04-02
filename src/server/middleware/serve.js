const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const MemoryFS = require('memory-fs')
const webpackBuilder = require('./webpackBuilder')
const getWebpackConfig = require('../../getWebpackConfig')
const fetchRemoteContent = require('../../fetchRemoteContent')
const renderRoutes = require('../../renderRoutes').default

const fs = new MemoryFS()
const webpackConfig = getWebpackConfig('development')
const compiler = webpack(webpackConfig)
const builder = webpackBuilder(compiler, 'scripts')

compiler.outputFileSystem = fs

const statics = (req, res, next) => {
  const assets = []
  const publicPath = webpackConfig.output.publicPath || ''
  const assetsByChunkName = res.locals.webpack.scripts.stats.toJson().assetsByChunkName

  Object.keys(assetsByChunkName).map(chunkName => {
    const chunkValue = assetsByChunkName[chunkName]

    if (chunkValue instanceof Array) {
      chunkValue.forEach(value => assets.push(publicPath + value))
    } else {
      assets.push(publicPath + chunkValue)
    }
  })

  const assetIndex = assets.indexOf(req.path)

  if (assetIndex > -1) {
    const filePath = path.join(webpackConfig.output.path, assets[assetIndex])

    if (fs.existsSync(filePath)) {
      fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
          console.log(chalk.red(`✘ Error reading static file from memory:`, filePath))
          return next()
        }

        res.status(200).send(data)
      })
    }
  } else {
    next()
  }
}

const pages = (req, res, next) => {
  const config = res.locals.config
  const clientScripts = res.locals.webpack.scripts.stats.toJson().assetsByChunkName.client
  const clientScript = clientScripts instanceof Array ? clientScripts[0] : clientScripts
  const scripts = [path.join(webpackConfig.output.publicPath, clientScript)]

  if (config) {
    console.log('🕗 Fetching remote content…')

    fetchRemoteContent((err, content) => {
      if (err) {
        console.log(chalk.red(`✘ Error fetching remote config:`, err.message))
      }

      console.log('🕗 Rendering routes…')

      renderRoutes({ config, content, scripts }, (err, files) => {
        if (err) {
          console.log(chalk.red(`✘ Error rendering routes:`))
          console.error(err)
          return res.status(500).send(err.toString())
        }

        const matchedKey = Object.keys(files).find(key => (
          key === req.path.slice(1) || key === path.join(req.path.slice(1), 'index.html')
        ))

        const notFoundKey = '404.html'
        const notFoundFile = files[notFoundKey]

        if (matchedKey) {
          res.status(200).send(files[matchedKey])
          console.log(chalk.green(`✔︎ Successfully served '${req.path}'`))
        } else if (notFoundFile) {
          res.status(200).send(notFoundFile)
          console.log(chalk.green(`✔︎ Successfully served '${notFoundKey}'`))
        } else {
          next()
        }
      })
    })
  }
}

module.exports = [builder, statics, pages]
