const mimeTypes = require('mime-types')
const MemoryFS = require('memory-fs')
const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const getWebpackConfig = require('./getWebpackConfig')

const icon = '🔧'

const configs = {
  development: getWebpackConfig('development'),
  production: getWebpackConfig('production')
}

const compilers = {
  development: webpack(configs.development),
  production: webpack(configs.production)
}

module.exports = function createDevServer () {
  const fs = new MemoryFS()
  const app = express()

  const middleware = webpackDevMiddleware(compilers.development, {
    stats: {
      chunks: false,
      colors: true
    }
  })

  app.post('/build', (req, res) => {
    console.log(icon, 'Compiling production scripts…')

    compilers.production.outputFileSystem = fs

    compilers.production.run((error, stats) => {
      if (error) {
        console.log(error)
        return res.status(500).json({ error })
      }

      const assets = stats.toJson().assets

      console.log(icon, 'Compiled', assets.length, 'scripts')

      const files = assets.map(asset => {
        console.log(icon, `Reading ${asset.name}…`)

        const path = `${configs.production.output.path}/${asset.name}`

        const data = fs.readFileSync(path)

        return {
          path: asset.name,
          type: mimeTypes.lookup(asset.name),
          data: data.toString('base64')
        }
      })

      console.log(icon, 'Done!')

      return res.status(200).json({
        files,
        stats: stats.toJson()
      })
    })
  })

  app.use(middleware)

  app.use((req, res) => {
    const notFoundPath = middleware.getFilenameFromUrl('/404.html')

    middleware.fileSystem.readFile(notFoundPath, (err, data) => {
      if (err) {
        res.status(404).send('notFoundRoute not configured')
      } else {
        res.status(404).send(data.toString('utf-8'))
      }
    })
  })

  app.listen(3000, () => {
    console.log('Server listening on http://localhost:3000')
  })
}
