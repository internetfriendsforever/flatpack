const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

const compiler = webpack(require('./webpack.config.js'))

const server = new WebpackDevServer(compiler, {
  stats: {
    chunks: false,
    colors: true
  }
})

server.listen(3000)

console.log('Server listening on http://localhost:3000')
