import { map, filter, mapValues, pick } from 'lodash'
import { S3 } from 'aws-sdk'

import { isBrowser, environment, s3Bucket, s3Region } from '../constants'

export const toggleEditing = () => ({
  type: 'TOGGLE_EDITING'
})

export const publish = ({ data, credentials, renderer }) => dispatch => {
  const { content } = data

  dispatch({
    type: 'PUBLISH'
  })

  const version = Date.now()

  const contentFile = {
    path: 'content.json',
    data: JSON.stringify(content),
    type: 'application/json'
  }

  let promise = new Promise(resolve => resolve({
    files: []
  }))

  if (isBrowser && environment === 'development') {
    promise = dispatch(build())
  }

  promise.then(buildResult => {
    const renderData = {
      ...data,
      ...pick(buildResult, 'assets')
    }

    dispatch(render({
      data: renderData,
      renderer,
      version
    })).then(files => {
      const allFiles = [
        ...files,
        ...buildResult.files,
        contentFile
      ]

      const uploadParams = {
        files: allFiles,
        credentials,
        version
      }

      dispatch(upload(uploadParams)).then(() => {
        dispatch(releaseVersion({ credentials, version })).then(() => {
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
          const assets = mapValues(result.stats.assetsByChunkName, asset => `/${asset}`)
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
            assets,
            files
          })
        }
      }
    })

    request.send()
  })
}

export const render = ({ data, renderer, version }) => dispatch => {
  dispatch({
    type: 'RENDER'
  })

  return new Promise((resolve, reject) => (
    renderer(data, (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(map(result, (html, path) => ({
          path: filter([...path.split('/'), `${version}-index.html`]).join('/'),
          type: 'text/html',
          data: html
        })))
      }
    })
  ))
}

export const upload = ({ files, credentials, version }) => dispatch => {
  dispatch({
    type: 'UPLOAD'
  })

  const uploads = files.map(file => uploadFile({ file, credentials }))

  return Promise.all(uploads).then(() => dispatch({
    type: 'UPLOAD_SUCCESS'
  }))
}

export const releaseVersion = ({ version, credentials }) => dispatch => {
  dispatch({
    type: 'RELEASE'
  })

  return new Promise((resolve, reject) => {
    const s3 = new S3({
      credentials,
      region: s3Region
    })

    console.log('Releasing version', version)
    console.log('Updating bucket website config...')

    s3.putBucketWebsite({
      Bucket: s3Bucket,
      WebsiteConfiguration: {
        IndexDocument: {
          Suffix: version + '-index.html'
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

function uploadFile ({ file, credentials }) {
  const key = file.path

  const s3 = new S3({
    credentials,
    region: s3Region
  })

  const params = {
    Bucket: s3Bucket,
    Key: key,
    Body: file.data,
    ContentType: file.type
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
