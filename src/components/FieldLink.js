import React from 'react'
import reject from 'lodash/reject'
import isNil from 'lodash/isNil'
import { getQuery, getQueryUrl } from '../utils/query'

export default ({ path, ...props }) => {
  const nextPath = reject([getQuery().path, path], isNil).join('/')
  const href = getQueryUrl({ ...getQuery(), path: nextPath })
  return <a {...props} href={href} />
}
