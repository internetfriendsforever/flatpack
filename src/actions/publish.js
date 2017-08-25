import S3 from 'aws-sdk/clients/s3'
import map from 'lodash/map'
import mime from 'mime-types'

export default ({ files, credentials, aws }) => {
  const blobs = map(files, (content, path) => ({
    path: path,
    data: new window.Blob([content], {
      type: mime.lookup(path)
    })
  }))

  const uploads = blobs.map(file => uploadFile(file, credentials, aws))

  return Promise.all(uploads).then(() => release({
    aws,
    credentials
  }).then(() => {
    console.log('Published!')
  }))
}

export const release = ({ credentials, aws }) => {
  return new Promise((resolve, reject) => {
    const s3 = new S3({
      credentials,
      region: aws.s3Region
    })

    console.log('Releasing version')
    console.log('Updating bucket website config...')

    s3.putBucketWebsite({
      Bucket: aws.s3Bucket,
      WebsiteConfiguration: {
        IndexDocument: {
          Suffix: `index.html`
        },
        ErrorDocument: {
          Key: `error.html`
        }
      }
    }, (err, data) => {
      if (err) {
        reject()
      } else {
        resolve()
      }
    })
  })
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
