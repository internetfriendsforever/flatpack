import filter from 'lodash/filter'

function documentFilePath (path) {
  return filter([...path.split('/'), 'index.html']).join('/')
}

export default function pack ({ manifest, value, path, routes }) {
  const currentRoutes = routes(value)
  const renderRoutes = Promise.all(currentRoutes.map(({ render }) => renderToString(render, manifest)))
  const fetchAssets = Promise.all(manifest.assets.map(asset => window.fetch(asset).then(res => res.text())))
  const renderEdit = renderToString(document => {}, manifest)

  return Promise.all([
    renderRoutes,
    fetchAssets,
    renderEdit
  ]).then(([
    rendered,
    assets,
    edit
  ]) => {
    const files = {}

    currentRoutes.forEach((route, i) => {
      files[documentFilePath(route.path)] = rendered[i]
    })

    manifest.assets.forEach((asset, i) => {
      files[filter(asset.split('/')).join('/')] = assets[i]
    })

    files['manifest.json'] = JSON.stringify({
      ...manifest,
      value
    }, null, 2)

    files[documentFilePath(path)] = edit

    return files
  })
}

function renderToString (render, manifest) {
  return new Promise((resolve, reject) => {
    const iframe = document.createElement('iframe')

    document.body.appendChild(iframe)
    const iframeDocument = iframe.contentDocument
    document.body.removeChild(iframe)

    render(iframeDocument)
    injectScripts(iframeDocument, manifest.scripts)
    injectMeta(iframeDocument)

    resolve(iframeDocument.documentElement.outerHTML)
  })
}

function injectScripts (document, scripts) {
  scripts.forEach(src => {
    const script = document.createElement('script')
    script.src = src
    document.body.appendChild(script)
  })
}

function injectMeta (document) {
  const meta = document.createElement('meta')
  meta.setAttribute('charset', 'utf-8')
  document.head.appendChild(meta)
}
