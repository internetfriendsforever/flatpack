import { map } from 'lodash'
import { S3 } from 'aws-sdk'
import renderRoutes from '../renderRoutes'

export const isBrowser = typeof document !== 'undefined'
export const isDevelopment = process.env.NODE_ENV !== 'production'

export const toggleEditing = () => ({
  type: 'TOGGLE_EDITING'
})

export const publish = ({ config, content, scripts, credentials, uploads }) => dispatch => {
  dispatch({
    type: 'PUBLISH'
  })

  const version = Date.now()

  let promise = new Promise(resolve => resolve({
    files: []
  }))

  if (isBrowser && isDevelopment) {
    promise = dispatch(build())
  }

  promise.then(buildResult => {
    const finalScripts = buildResult.scripts || scripts

    const contentFile = {
      path: 'content.json',
      data: new window.Blob([JSON.stringify(content)], {
        type: 'application/json'
      })
    }

    renderRoutes({
      config,
      content,
      version,
      scripts: finalScripts
    }, (err, renderedRoutes) => {
      if (err) {
        return console.error('Error rendering routes:', err)
      }

      const renderedFiles = map(renderedRoutes, (html, path) => ({
        path,
        data: new window.Blob([html], {
          type: 'text/html'
        })
      }))

      const files = [
        contentFile,
        ...uploads,
        ...buildResult.files,
        ...renderedFiles
      ]

      dispatch(upload(
        files,
        credentials,
        version
      )).then(() => {
        dispatch(releaseVersion(
          credentials,
          version
        )).then(() => {
          dispatch({
            type: 'PUBLISH_SUCCESS'
          })
        })
      })
    })
  })
}

export const build = () => dispatch => {
  dispatch({
    type: 'BUILD'
  })

  return new Promise((resolve, reject) => {
    const request = new window.XMLHttpRequest()

    request.open('post', '/build')

    request.addEventListener('readystatechange', () => {
      if (request.readyState === window.XMLHttpRequest.DONE) {
        if (request.status === 200) {
          const result = JSON.parse(request.responseText)
          const stats = result.stats
          const clientPath = `${stats.publicPath}${stats.assetsByChunkName.client}`
          const scripts = [clientPath]

          const files = result.files.map(file => {
            const byteString = window.atob(file.data)
            const content = new Uint8Array(byteString.length)

            for (let i = 0; i < byteString.length; i++) {
              content[i] = byteString.charCodeAt(i)
            }

            return {
              ...file,
              data: new window.Blob([content], {
                type: file.type
              })
            }
          })

          dispatch({
            type: 'BUILD_SUCCESS'
          })

          resolve({
            scripts,
            files
          })
        }
      }
    })

    request.send()
  })
}

export const upload = (files, credentials, version) => dispatch => {
  dispatch({
    type: 'UPLOAD'
  })

  const uploads = files.map(file => uploadFile(file, credentials))

  return Promise.all(uploads).then(() => dispatch({
    type: 'UPLOAD_SUCCESS'
  }))
}

export const releaseVersion = (credentials, version) => dispatch => {
  dispatch({
    type: 'RELEASE'
  })

  return new Promise((resolve, reject) => {
    const s3 = new S3({
      credentials,
      region: window.aws.s3Region
    })

    console.log('Releasing version', version)
    console.log('Updating bucket website config...')

    s3.putBucketWebsite({
      Bucket: window.aws.s3Bucket,
      WebsiteConfiguration: {
        IndexDocument: {
          Suffix: version + '-index.html'
        },
        ErrorDocument: {
          Key: version + '-404.html'
        }
      }
    }, (err, data) => {
      if (err) {
        dispatch({
          type: 'RELEASE_ERROR'
        })

        reject()
      } else {
        dispatch({
          type: 'RELEASE_SUCCESS'
        })

        resolve()
      }
    })
  })
}

function uploadFile (file, credentials) {
  const key = file.path

  const s3 = new S3({
    credentials,
    region: window.aws.s3Region
  })

  const params = {
    Bucket: window.aws.s3Bucket,
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
