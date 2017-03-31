const proxy = require('express-http-proxy')
const aws = require('../config/aws')

module.exports = proxy(aws.s3Bucket + '.s3.amazonaws.com', {
  forwardPath: function (req, res) {
    return '/uploads' + require('url').parse(req.url).path
  }
})
