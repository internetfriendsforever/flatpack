const path = require('path')
const RawSource = require('webpack-sources/lib/RawSource')
const renderToStaticMarkup = require('react-dom/server').renderToStaticMarkup
const normalizeEntry = require('./normalizeEntry')

const babelOptions = {
  presets: [
    require.resolve('babel-preset-es2015'),
    require.resolve('babel-preset-react')
  ]
}

require('babel-register')(babelOptions)

const entryPath = path.resolve(process.cwd(), 'index.js')
const bootstrapPath = path.resolve(__dirname, 'bootstrap.js')
const outputPath = path.resolve(process.cwd(), 'build')

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
      Object.keys(require.cache).forEach(key => {
        if (!/node_modules/.test(key)) {
          delete require.cache[key]
        }
      })

      const entry = normalizeEntry(require(entryPath))
      const routes = entry.routes(content)
      const template = entry.template

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
  entry: {
    bootstrap: bootstrapPath
  },

  output: {
    path: outputPath,
    filename: '[name].js'
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
      entry: entryPath
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
