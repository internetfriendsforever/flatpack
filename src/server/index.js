const express = require('express')
const chalk = require('chalk')
const openport = require('openport')

const build = require('./middleware/build')
const upload = require('./middleware/upload')
const scripts = require('./middleware/scripts')
const config = require('./middleware/config')
const serve = require('./middleware/serve')
const error = require('./middleware/error')

module.exports = function createServer () {
  const app = express()

  app.post('/build', build)
  app.use('/uploads', upload)
  app.use(scripts)
  app.use(config)
  app.use(serve)
  app.use(error)

  openport.find({
    startingPort: 3000,
    endingPort: 4000
  }, function (err, port) {
    if (err) {
      return console.log(err)
    }

    app.listen(3000, () => {
      console.log('✨ Server listening at: ' + chalk.underline(chalk.bold('http://localhost:' + port)))
    })
  })
}
