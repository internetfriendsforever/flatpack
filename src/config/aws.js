const path = require('path')

try {
  module.exports = require(path.resolve(process.cwd(), 'aws.json'))
} catch (err) {
  module.exports = {}
}
