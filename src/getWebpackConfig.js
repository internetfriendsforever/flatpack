const path = require('path')
const fs = require('fs')
const { assignWith, isUndefined, isPlainObject, isArray } = require('lodash')

const merge = (...objs) => assignWith({}, ...objs, (objValue, srcValue) => (
  isPlainObject(objValue) && isPlainObject(srcValue) ? merge(srcValue, objValue)
  : isArray(objValue) && isArray(srcValue) ? [...srcValue, ...objValue]
  : isUndefined(objValue) ? srcValue : objValue
))

module.exports = function getWebpackConfig (environment) {
  const baseConfig = require(`./webpack.${environment}.config.js`)
  const projectConfigPath = path.resolve(process.cwd(), 'webpack.config.js')

  let transform = config => config

  if (fs.existsSync(projectConfigPath)) {
    let projectConfig = require(projectConfigPath)

    projectConfig = projectConfig.default || projectConfig

    if (isPlainObject(projectConfig)) {
      transform = config => merge(config, projectConfig)
    } else if (typeof projectConfig === 'function') {
      transform = projectConfig
    }
  }

  return transform(baseConfig)
}
