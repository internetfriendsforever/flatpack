import React from 'react'
import ReactDOM from 'react-dom'
import Provider from './components/Provider'
import history from './history'
import configDefaults from './config/defaults'

// Provided through webpack resolve alias in webpack.config.js
const config = configDefaults(require('config'))

const content = JSON.parse(window.content || '{}')
const routes = config.routes(content)

function withProvider (component, content, callback) {
  callback(
    <Provider content={content} config={config} assets={{}}>
      {component}
    </Provider>
  )
}

// function withEditor (component, content, callback) {
//   require.ensure(['./components/Editor'], () => {
//     const Editor = require('./components/Editor').default
//
//     withProvider((
//       <Editor>
//         {component}
//       </Editor>
//     ), content, callback)
//   }, 'editor')
// }

function route () {
  const pathname = history.location.pathname
  const route = routes.find(route => route.path === pathname)
  const component = route && route.component || config.notFoundRoute

  withProvider(component, content, result => (
    ReactDOM.render(result, root)
  ))
}

history.listen(route)
window.addEventListener('load', route)
