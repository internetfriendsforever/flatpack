import { map, mapValues, keyBy, sortBy, omit, indexOf } from 'lodash'

// Serialized (stored) state:
// { _order: ['a', 'b'], a: {}, b: {}}
export function serialize (value) {
  const order = map(value, ({ key }) => key)
  const items = mapValues(keyBy(value, 'key'), 'item')

  return {
    _order: order,
    ...items
  }
}

// Deserialized (internal) state:
// [{ key: 'a', value: {}}, { key: 'b', value: {}}]
export function deserialize (value) {
  const onlyItems = omit(value, '_order')
  const items = map(onlyItems, (item, key) => ({ key, item }))

  return sortBy(items, ({item, key}) => (
    indexOf(value._order, key)
  ))
}
