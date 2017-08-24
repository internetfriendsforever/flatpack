import filter from 'lodash/filter'

function documentFilePath (path) {
  return filter([...path.split('/'), 'index.html']).join('/')
}

export default function pack ({ aws, manifest, value, path, fields, routes }) {
  const currentRoutes = routes(value)
  const renderRoutes = Promise.all(currentRoutes.map(({ render }) => renderToString({ render, manifest })))
  const fetchAssets = Promise.all(manifest.assets.map(asset => window.fetch(asset).then(res => res.text())))
  const renderEdit = renderToString({ render: document => {}, manifest })

  return Promise.all([
    renderRoutes,
    fetchAssets,
    renderEdit
  ]).then(([
    rendered,
    assets,
    edit
  ]) => {
    const files = [
      {
        path: documentFilePath(path),
        data: new window.Blob([edit], {
          type: 'text/html'
        })
      },

      {
        path: 'flatpack/value.json',
        data: new window.Blob([JSON.stringify(value, null, 2)], {
          type: 'text/html'
        })
      },

      ...currentRoutes.map((route, i) => ({
        path: documentFilePath(route.path),
        data: new window.Blob([rendered[i]], {
          type: 'text/html'
        })
      })),

      ...manifest.assets.map((asset, i) => ({
        path: filter(asset.split('/')).join('/'),
        data: new window.Blob([assets[i]], {
          type: 'application/javascript'
        })
      }))
    ]

    return files
  })
}

function renderToString ({ render, manifest }) {
  const injectMeta = [`<meta charset="utf-8" />`].join('')
  const injectMetaAfter = '<head>'
  const injectScripts = manifest.scripts.map(script => `<script src="${script}"></script>`).join('')
  const injectScriptsBefore = '</body>'

  return new Promise((resolve, reject) => {
    const iframe = document.createElement('iframe')
    document.body.appendChild(iframe)
    render(iframe.contentDocument)
    resolve(
      iframe.contentDocument.documentElement.innerHTML
        .replace(injectScriptsBefore, `${injectScripts}${injectScriptsBefore}`)
        .replace(injectMetaAfter, `${injectMetaAfter}${injectMeta}`)
    )
  })
}
