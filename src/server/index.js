const express = require('express')

const build = require('./build')
const upload = require('./upload')
const webpack = require('./webpack')

module.exports = function createServer () {
  const app = express()

  app.post('/build', build)
  app.get('/uploads', upload)
  app.use(webpack)

  app.use((req, res) => {
    res.status(404).send('Not found')
  })

  app.listen(3000, () => {
    console.log('Server listening on http://localhost:3000')
  })
}
