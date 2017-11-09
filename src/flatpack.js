import 'history-events'
import trimEnd from 'lodash/trimEnd'
import trimStart from 'lodash/trimStart'
import isUrlExternal from './utils/isUrlExternal'
import loadScript from './utils/loadScript'

function normalizePath (path) {
  return trimStart(trimEnd(path, '/'), '/')
}

const defaultOptions = {
  aws: null,
  path: 'edit',
  fields: {},
  routes: () => [],
  manifest: window.manifest || {}
}

export default options => {
  const { aws, path, fields, routes, manifest } = Object.assign({}, defaultOptions, options)
  const value = manifest.value || {}

  const loadAsyncModule = (() => {
    const modules = {}

    return name => new Promise((resolve, reject) => {
      if (modules[name]) {
        resolve(modules[name])
      } else {
        const index = manifest.asyncModules[name]
        const src = manifest.assets[index]
        loadScript(src).then(() => {
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

  window.addEventListener('load', render)
  window.addEventListener('popstate', render)
  window.addEventListener('changestate', render)

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
}
