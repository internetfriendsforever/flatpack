import page from 'page.js'

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

      function loadAsyncModule (name) {
        return loadScript(manifest.asyncModules[name]).then(() => (
          window.asyncModule[name]
        ))
      }

      page(path, () => {
        loadAsyncModule('edit').then(edit => {
          edit({ value, aws, fields, router })
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
