const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const config = require('./webpack.config.js')

export default function createDevServer () {
  const compiler = webpack(config)

  const app = express()

  const middleware = webpackDevMiddleware(compiler, {
    stats: {
      chunks: false,
      colors: true
    }
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
