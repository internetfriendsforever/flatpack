import React from 'react'
import { getQuery, getQueryUrl } from '../utils/query'

export default ({ path, ...props }) => {
  const href = getQueryUrl({ ...getQuery(), content: path })

  return <a {...props} href={href} />
}
