import S3 from 'aws-sdk/clients/s3'
import generate from 'nanoid/generate'

export default ({ files, credentials, aws }) => {
  const version = generate('1234567890abcdef', 10)
  const uploads = files
    .map(file => versionFile(file, version))
    .map(file => uploadFile(file, credentials, aws))

  return Promise.all(uploads).then(() => releaseVersion({
    aws,
    credentials,
    version
  }).then(() => {
    console.log('Published!')
  }))
}

export const releaseVersion = ({ credentials, version, aws }) => {
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
          Suffix: `${version}-index.html`
        },
        ErrorDocument: {
          Key: `${version}-error.html`
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

function versionFile (file, version) {
  file.path = file.path.replace(/index\.html$/, `${version}-index.html`)
  return file
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
