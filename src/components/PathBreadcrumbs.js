import React from 'react'
import filter from 'lodash/filter'
import Breadcrumbs from './Breadcrumbs'
import { getQuery, getQueryUrl } from '../utils/query'

export default ({ segments, resolved }) => {
  const paths = segments.reduce((paths, segment) => {
    paths.push(filter([paths[paths.length - 1], segment]).join('/'))
    return paths
  }, [])

  const items = paths.map((path, i) => ({
    path: getQueryUrl({ ...getQuery(), path }),
    label: resolved[i]
  }))

  if (items.length) {
    items.unshift({
      path: getQueryUrl({ ...getQuery(), path: '' }),
      label: 'Edit'
    })
  }

  return <Breadcrumbs items={items} />
}
