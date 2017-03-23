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

function sanitizeJSON (string) {
  return string
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
    .replace(/'/g, '\\u0027')
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

      const injectBefore = '</body>'
      const injection = `
        <script>
          window.content = '${sanitizeJSON(JSON.stringify(content))}';
          window.scripts = '${JSON.stringify(scripts)}';
        </script>
        ${scripts.map(script => `
          <script src="${script}"></script>
        `)}
      `

      let rendered = template(html, route.title)

      if (rendered.indexOf(injectBefore) === -1) {
        rendered += injection
      } else {
        rendered = rendered.replace(injectBefore, `${injection}${injectBefore}`)
      }

      files[filepath] = rendered
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
