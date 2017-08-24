import page from 'page.js'
import qs from 'qs'

function loadScript (src, callback) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    document.body.appendChild(script)
    script.addEventListener('load', () => {
      resolve()
    })
  })
}

export default ({ defaultValue, aws, path, fields, router }) => {
  window.fetch('/flatpack/manifest.json')
    .then(res => res.json())
    .then(manifest => {
      const value = manifest.value || defaultValue || {}

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

      page((context, next) => {
        context.query = qs.parse(context.querystring)
        next()
      })

      page(path, location => {
        loadAsyncModule('edit').then(edit => {
          edit({ location, value, aws, fields, router })
        })
      })

      router(value).forEach(route => (
        page(route.path, () => {
          route.render(document)
        })
      ))

      page.start()
    })
}
