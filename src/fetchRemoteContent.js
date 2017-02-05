const aws = require('aws-sdk')
const awsConfig = require('./config/aws')

module.exports = callback => {
  if (!awsConfig.s3Region || !awsConfig.s3Bucket) {
    return callback({})
  }

  new aws.S3({
    region: awsConfig.s3Region
  }).makeUnauthenticatedRequest('getObject', {
    Bucket: awsConfig.s3Bucket,
    Key: 'content.json'
  }, (err, data) => {
    if (err) {
      callback({})
    } else {
      callback(JSON.parse(data.Body.toString()))
    }
  })
}
