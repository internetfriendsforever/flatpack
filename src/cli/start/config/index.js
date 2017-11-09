const path = require('path')
const fs = require('fs')

module.exports = function (options) {
  const customConfigPath = path.resolve(process.cwd(), 'webpack.config.js')
  const customExists = fs.existsSync(customConfigPath)
  const config = customExists ? require(customConfigPath) : require('./default')(options)

  return config
}
