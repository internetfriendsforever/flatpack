import qs from 'qs'
import pickBy from 'lodash/pickBy'

export function getQuery () {
  return qs.parse(window.location.search.substring(1))
}

export function getQueryUrl (query, options = { encode: false }) {
  const filtered = filterQuery(query)

  if (Object.keys(filtered).length) {
    return `${window.location.pathname}?${qs.stringify(filtered, options)}`
  } else {
    return `${window.location.pathname}`
  }
}

export function filterQuery (query) {
  return pickBy(query, value => !!value)
}

export function setQuery (query, replace = false) {
  const fn = replace ? 'replaceState' : 'pushState'
  window.history[fn](null, null, getQueryUrl(query))
}

export function updateQuery (changes, ...rest) {
  setQuery({ ...getQuery(), ...changes }, ...rest)
}
