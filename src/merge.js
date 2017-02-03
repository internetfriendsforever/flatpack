import { assignWith, isUndefined, isPlainObject, isArray } from 'lodash'

const merge = (...objs) => assignWith({}, ...objs, (objValue, srcValue) => (
  isPlainObject(objValue) && isPlainObject(srcValue) ? merge(srcValue, objValue)
  : isArray(objValue) && isArray(srcValue) ? [...srcValue, ...objValue]
  : isUndefined(objValue) ? srcValue : objValue
))

export default merge
