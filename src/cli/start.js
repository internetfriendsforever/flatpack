const express = require('express')
const openport = require('openport')
const webpack = require('./middleware/webpack')

module.exports = function () {
  openport.find({
    startingPort: 3000,
    endingPort: 4000
  }, function (err, port) {
    if (err) {
      return console.log(err)
    }

    const app = express()

    app.use(webpack({ port }))
    app.listen(port)
  })
}
