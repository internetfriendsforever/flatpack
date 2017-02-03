import React from 'react'
import ReactDOM from 'react-dom'
import Provider from './components/Provider'
import history from './history'
import configDefaults from './config/defaults'

// Provided through webpack resolve alias in webpack.config.js
const config = configDefaults(require('config'))

const content = JSON.parse(window.content || '{}')
const scripts = JSON.parse(window.scripts || '{}')
const routes = config.routes(content)

function route () {
  const pathname = history.location.pathname
  const route = routes.find(route => route.path === pathname)
  const component = route && route.component || config.notFoundRoute

  ReactDOM.render((
    <Provider content={content} config={config} scripts={scripts}>
      {component}
    </Provider>
  ), root)
}

history.listen(route)
window.addEventListener('load', route)
