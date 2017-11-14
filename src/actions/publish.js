import S3 from 'aws-sdk/clients/s3'
import filter from 'lodash/filter'
import generate from 'nanoid/generate'
import mime from 'mime-types'
import traverse from 'traverse'

export default ({ manifest, value, path, routes, credentials, aws }) => {
  const version = generate('1234567890abcdef', 10)

  return createAttachments(value).then(attachments => {
    const publishManifest = {
      ...manifest,
      assets: manifest.assets.map(path => getAssetPath(path)),
      value: attachments.modifiedValue
    }

    const currentRoutes = routes(attachments.modifiedValue)
    const renderRoutes = Promise.all(currentRoutes.map(({ render }) => renderToString(render, publishManifest)))
    const fetchAssets = Promise.all(manifest.assets.map(asset => window.fetch(asset).then(res => res.text())))
    const renderEdit = renderToString(document => {}, publishManifest)

    return Promise.all([
      renderRoutes,
      fetchAssets,
      renderEdit
    ]).then(([
      rendered,
      assets,
      edit
    ]) => {
      const files = []

      currentRoutes.forEach((route, i) => {
        files.push({
          path: getDocumentPath(route.path, version),
          data: new window.Blob([rendered[i]], { type: 'text/html' })
        })
      })

      publishManifest.assets.forEach((path, i) => {
        files.push({
          path: stripPath(path),
          data: new window.Blob([assets[i]], { type: mime.lookup(path) })
        })
      })

      files.push({
        path: getDocumentPath(path, version),
        data: new window.Blob([edit], { type: 'text/html' })
      })

      files.push(...attachments.files)

      const uploads = files.map(file => uploadFile(file, credentials, aws))

      return Promise.all(uploads).then(() => release({
        aws,
        credentials,
        version
      }))
    })
  })
}

function release ({ credentials, aws, version }) {
  return new Promise((resolve, reject) => {
    const s3 = new S3({
      credentials,
      region: aws.s3Region
    })

    console.log('Releasing version', version)
    console.log('Updating bucket website config...')

    s3.putBucketWebsite({
      Bucket: aws.s3Bucket,
      WebsiteConfiguration: {
        IndexDocument: {
          Suffix: `index-${version}.html`
        },
        ErrorDocument: {
          Key: `error-${version}.html`
        }
      }
    }, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

function stripPath (path) {
  return filter(path.split('/')).join('/')
}

function getDocumentPath (path, version) {
  return stripPath([path, `index-${version}.html`].join('/'))
}

function getAssetPath (path) {
  const segments = filter(path.split('/'))
  if (segments[0] !== 'assets') {
    segments.unshift('assets')
  }
  return `/${segments.join('/')}`
}

function renderToString (render, manifest) {
  return new Promise((resolve, reject) => {
    const iframe = document.createElement('iframe')

    document.body.appendChild(iframe)
    const iframeDocument = iframe.contentDocument
    document.body.removeChild(iframe)

    render(iframeDocument)

    const manifestScript = iframeDocument.createElement('script')
    manifestScript.innerHTML = `window.manifest = ${JSON.stringify(manifest)}`
    iframeDocument.body.appendChild(manifestScript)

    injectScripts(iframeDocument, manifest.scripts.map(index => manifest.assets[index]))
    injectMeta(iframeDocument)

    resolve(iframeDocument.documentElement.outerHTML)
  })
}

function injectScripts (document, scripts) {
  scripts.forEach(src => {
    const script = document.createElement('script')
    script.src = `${src}`
    document.body.appendChild(script)
  })
}

function injectMeta (document) {
  const meta = document.createElement('meta')
  meta.setAttribute('charset', 'utf-8')
  document.head.appendChild(meta)
}

function uploadFile (file, credentials, aws) {
  const key = file.path

  const s3 = new S3({
    credentials,
    region: aws.s3Region
  })

  const params = {
    Bucket: aws.s3Bucket,
    Key: key,
    Body: file.data,
    ContentType: file.type || file.data.type
  }

  console.log('Uploading', key)

  return new Promise((resolve, reject) => {
    s3.putObject(params, function (err, res) {
      if (err) {
        reject(err)
      } else {
        console.log('Done', key)
        resolve(key)
      }
    })
  })
}

function createAttachments (value) {
  const items = []

  const modifiedValue = traverse.map(value, value => {
    if (typeof value === 'string' && value.startsWith('blob:')) {
      const relativePath = `assets/${generate('1234567890abcdef', 10)}`
      const absolutePath = `/${relativePath}`

      items.push({
        relativePath: relativePath,
        absolutePath: absolutePath,
        source: value
      })

      return absolutePath
    }
  })

  return Promise.all(items.map(item => (
    window.fetch(item.source).then(res => res.blob())
  ))).then(blobs => {
    const files = items.map((item, i) => ({
      path: item.relativePath,
      data: blobs[i]
    }))

    return {
      modifiedValue,
      files
    }
  })
}
