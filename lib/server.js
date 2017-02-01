const babelOptions = {
  presets: [
    require.resolve('babel-preset-es2015'),
    require.resolve('babel-preset-react')
  ]
}

require('babel-register')(babelOptions)

const path = require('path')
const RawSource = require('webpack-sources/lib/RawSource')
const renderToStaticMarkup = require('react-dom/server').renderToStaticMarkup
const createConfig = require('./createConfig')

const projectConfigPath = path.resolve(process.cwd(), 'index.js')

const content = {
  books: [
    { id: 1, title: 'Book one' },
    { id: 2, title: 'Book two' }
  ]
}

const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

const StaticPlugin = function () {}

StaticPlugin.prototype.apply = function (compiler) {
  compiler.plugin('this-compilation', function (compilation) {
    compilation.plugin('optimize-assets', function (_, done) {
      // Clear require cache
      Object.keys(require.cache).forEach(key => {
        if (!/node_modules/.test(key)) {
          delete require.cache[key]
        }
      })

      const appConfig = require(projectConfigPath)
      const config = createConfig(appConfig)
      const routes = config.routes(content)
      const template = config.template

      routes.forEach(route => {
        const filePath = path.join(route.path, '/index.html').replace(/^\//, '')
        const html = renderToStaticMarkup(route.component)
        const page = template(html, content)

        compilation.assets[filePath] = new RawSource(page)
      })

      done()
    })
  })
}

const compiler = webpack({
  entry: path.resolve(__dirname, 'client.js'),

  output: {
    path: path.resolve(process.cwd(), 'build'),
    filename: 'client.js'
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: require.resolve('babel-loader'),
        exclude: /node_modules/,
        query: babelOptions
      }
    ]
  },

  plugins: [
    new StaticPlugin()
  ],

  resolve: {
    alias: {
      projectConfig: projectConfigPath
    }
  }
})

const server = new WebpackDevServer(compiler, {
  stats: {
    chunks: false,
    colors: true
  }
})

server.listen(3000)

console.log('Server listening on http://localhost:3000')
