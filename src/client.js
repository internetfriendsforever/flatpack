import React from 'react'
import ReactDOM from 'react-dom'
import Provider from './components/Provider'
import history from './history'
import configDefaults from './config/defaults'

// Provided through webpack resolve alias in webpack.config.js
const config = configDefaults(require('config'))

const content = JSON.parse(window.content || '{}')
const routes = config.routes(content)

function render (component) {
  const root = document.getElementById('root')

  ReactDOM.render((
    <Provider content={content} assets={{}}>
      {component}
    </Provider>
  ), root)
}

function route () {
  const pathname = history.location.pathname
  const route = routes.find(route => route.path === pathname)

  if (route) {
    render(route.component)
  } else {
    if (config.notFoundRoute) {
      render(config.notFoundRoute)
    } else {
      console.error(pathname, 'not found, and not notFoundRoute configured')
    }
  }
}

history.listen(route)
window.addEventListener('load', route)
