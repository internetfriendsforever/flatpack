require('babel-register')(require('./babel'))

const path = require('path')
const FileWriterWebpackPlugin = require('./FileWriterWebpackPlugin')
const renderToStaticMarkup = require('react-dom/server').renderToStaticMarkup
const configPath = require('./config/path')
const configDefaults = require('./config/defaults')

// TODO: Get content from somewhere
const content = {
  books: [
    { id: 1, title: 'Book one' },
    { id: 2, title: 'Book two' }
  ]
}

module.exports = {
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
        query: require('./babel')
      }
    ]
  },

  plugins: [
    new FileWriterWebpackPlugin(() => {
      // Clear require cache
      Object.keys(require.cache).forEach(key => {
        if (!/node_modules/.test(key)) {
          delete require.cache[key]
        }
      })

      const projectConfig = require(configPath)
      const config = configDefaults(projectConfig)
      const routes = config.routes(content)
      const template = config.template

      const files = {}

      routes.forEach(route => {
        const filepath = path.join(route.path, '/index.html').replace(/^\//, '')
        const html = renderToStaticMarkup(route.component)
        files[filepath] = template(html, content)
      })

      if (config.notFoundRoute) {
        const html = renderToStaticMarkup(config.notFoundRoute)
        files['404.html'] = template(html, content)
      }

      return files
    })
  ],

  resolve: {
    alias: {
      config: configPath
    }
  }
}
