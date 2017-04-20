import React from 'react'
import ReactDOM from 'react-dom'
import { createBrowserHistory } from 'history'
import Provider from './components/Provider'
import configDefaults from './config/defaults'
import stringToObject from './utils/stringToObject'

// Provided through webpack resolve alias in webpack.config.js
const config = configDefaults(require('config'))

const history = createBrowserHistory()

const content = stringToObject(window.content || '{}')
const scripts = stringToObject(window.scripts || '{}')
const routes = config.routes(content)

function route () {
  const pathname = history.location.pathname
  const route = routes.find(route => route.path === pathname) || config.notFoundRoute
  const { component, title } = route

  ReactDOM.render((
    <Provider
      title={title}
      content={content}
      config={config}
      scripts={scripts}
      history={history}
      children={component}
    />
  ), root)
}

history.listen(route)
window.addEventListener('load', route)
