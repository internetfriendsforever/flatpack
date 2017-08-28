import React from 'react'
import Link from '../ui/Link'
import { getQuery, getQueryUrl } from '../utils/query'

export default ({ path, ...props }) => {
  const href = getQueryUrl({ ...getQuery(), path })
  return <Link {...props} href={href} />
}
