import React from 'react'
import Provider from './components/Provider'
import { renderToStaticMarkup } from 'react-dom/server'

function renderWithProvider (component, config, content, scripts) {
  return renderToStaticMarkup(
    <Provider content={content} config={config} assets={{}} scripts={scripts}>
      {component}
    </Provider>
  )
}

export default function renderRoutes (config, content, scripts, version) {
  const prefix = version ? `${version}-` : ''
  const routes = config.routes(content)
  const template = config.template
  const files = {}

  // Route files
  routes.forEach(route => {
    if (route.path.slice(-1) !== '/') {
      throw new Error(`Route path '${route.path}' is missing trailing slash.`)
    }

    const filepath = (`/${route.path}/${prefix}index.html`).split('/').filter(v => !!v).join('/')
    const html = renderWithProvider(route.component, config, content, scripts)

    files[filepath] = template(html, content, scripts)
  })

  // 404 file
  if (config.notFoundRoute) {
    const html = renderWithProvider(config.notFoundRoute, config, content, scripts)
    files[`${prefix}404.html`] = template(html, content)
  }

  return files
}
