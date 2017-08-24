import React from 'react'
import qs from 'qs'

export default ({ path, ...props }) => {
  const { search, pathname } = window.location
  const query = qs.parse(search.substring(1))

  if (path) {
    query.path = path
  } else {
    delete query.path
  }

  const segments = [pathname]

  if (Object.keys(query).length) {
    segments.push(`?${qs.stringify(query)}`)
  }

  const href = segments.join('')

  return <a {...props} href={href} onClick={e => {
    console.log(path, e)
  }} />
}
