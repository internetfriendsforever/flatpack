const path = require('path')
const chalk = require('chalk')
const getWebpackConfig = require('../../getWebpackConfig')
const fetchRemoteContent = require('../../fetchRemoteContent')
const renderRoutes = require('../../renderRoutes').default

const webpackConfig = getWebpackConfig('development')

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
    res.sendFile(path.join(webpackConfig.output.path, assets[assetIndex]))
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

        if (matchedKey) {
          res.status(200).send(files[matchedKey])
          console.log(chalk.green(`✔︎ Successfully served '${req.path}'`))
        } else {
          next()
        }
      })
    })
  }
}

module.exports = [statics, pages]
