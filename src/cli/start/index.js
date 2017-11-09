const openport = require('openport')
const WebpackDevServer = require('webpack-dev-server')
const webpack = require('webpack')
const getConfig = require('./config')

module.exports = function () {
  openport.find({
    startingPort: 3000,
    endingPort: 4000
  }, function (err, port) {
    if (err) {
      return console.log(err)
    }

    const config = getConfig({ port })
    const compiler = webpack(config)
    const server = new WebpackDevServer(compiler, config.devServer)

    server.listen(port)
  })
}
