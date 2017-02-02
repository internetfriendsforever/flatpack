const ReactDOM = require('react-dom')
const history = require('./history')
const configDefaults = require('./config/defaults')

// Provided through webpack resolve alias in webpack.config.js
const config = configDefaults(require('config'))

const content = JSON.parse(window.content || '{}')
const routes = config.routes(content)

function render () {
  const pathname = history.location.pathname
  const route = routes.find(route => route.path === pathname)

  if (route) {
    const root = document.getElementById('root')
    ReactDOM.render(route.component, root)
  } else {
    if (config.notFoundRoute) {
      ReactDOM.render(config.notFoundRoute, root)
    } else {
      console.error(pathname, 'not found, and not notFoundRoute configured')
    }
  }
}

history.listen(render)

window.addEventListener('load', render)
