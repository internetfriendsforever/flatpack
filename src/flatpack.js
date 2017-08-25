import 'history-events'
import trimEnd from 'lodash/trimEnd'
import trimStart from 'lodash/trimStart'
import isUrlExternal from './utils/isUrlExternal'
import loadScript from './utils/loadScript'

function normalizePath (path) {
  return trimStart(trimEnd(path, '/'), '/')
}

export default ({ defaultValue, aws, path, fields, routes }) => {
  window.fetch('/flatpack/manifest.json')
    .then(res => res.json())
    .then(manifest => {
      const value = manifest.value || defaultValue || {}

      console.log(manifest)

      const loadAsyncModule = (() => {
        const modules = {}

        return name => new Promise((resolve, reject) => {
          if (modules[name]) {
            resolve(modules[name])
          } else {
            loadScript(manifest.asyncModules[name]).then(() => {
              modules[name] = window.asyncModule[name]
              resolve(modules[name])
            })
          }
        })
      })()

      function match (expression) {
        return normalizePath(window.location.pathname) === normalizePath(expression)
      }

      function render () {
        if (match(path)) {
          loadAsyncModule('edit').then(edit => {
            edit({ value, aws, fields, routes, manifest, path })
          })
        }

        routes(value).forEach(route => {
          if (match(route.path)) {
            route.render(document)
          }
        })
      }

      window.addEventListener('popstate', render)
      window.addEventListener('changestate', render)

      render()

      document.addEventListener('click', e => {
        const link = e.target.closest('a')

        if (link) {
          e.preventDefault()

          if (!isUrlExternal(link.href)) {
            window.history.pushState(null, null, link.href)
          } else {
            window.open(link.href)
          }
        }
      })
    })
}
