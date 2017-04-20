import React from 'react'
import { createMemoryHistory } from 'history'
import { renderToStaticMarkup } from 'react-dom/server'
import Provider from './components/Provider'
import objectToString from './utils/objectToString'

function inject (html, content, scripts) {
  let result = html

  const injectBefore = '</body>'
  const injection = `
    <script>
      window.content = '${objectToString(content)}';
      window.scripts = '${objectToString(scripts)}';
    </script>
    ${scripts.map(script => `
      <script src="${script}"></script>
    `)}
  `

  if (result.indexOf(injectBefore) === -1) {
    result += injection
  } else {
    result = result.replace(injectBefore, `${injection}${injectBefore}`)
  }

  return result
}

function renderWithProvider (component, config, content, scripts) {
  const html = renderToStaticMarkup(
    <Provider content={content} config={config} assets={{}} scripts={scripts} history={createMemoryHistory()}>
      {component}
    </Provider>
  )

  return inject(html, content, scripts)
}

export default function renderRoutes ({ config, content, scripts, version }, callback) {
  const prefix = version ? `${version}-` : ''
  const routes = config.routes(content)
  const template = config.template
  const files = {}

  try {
    // Route files
    routes.forEach(route => {
      if (route.path.slice(-1) !== '/') {
        callback(new Error(`Route path '${route.path}' is missing trailing slash.`))
      }

      const filepath = (`/${route.path}/${prefix}index.html`).split('/').filter(v => !!v).join('/')
      const html = renderWithProvider(route.component, config, content, scripts)

      files[filepath] = template(html, route.title)
    })

    // 404 file
    if (config.notFoundRoute) {
      const html = renderWithProvider(config.notFoundRoute.component, config, content, scripts)
      files[`${prefix}404.html`] = template(html, config.notFoundRoute.title, content)
    }

    callback(null, files)
  } catch (err) {
    callback(err)
  }
}
