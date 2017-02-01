require('babel-register')(require('./babel'))

const path = require('path')
const renderToStaticMarkup = require('react-dom/server').renderToStaticMarkup
const configDefaults = require('./config/defaults')
const configPath = require('./config/path')

module.exports = function render () {
  const content = {
    books: [
      { id: 1, title: 'Book one' },
      { id: 2, title: 'Book two' }
    ]
  }

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

  return files
}
