import { map, sortBy, omit, indexOf } from 'lodash'

// Deserialized (internal) state:
// [{ key: 'a', value: {}}, { key: 'b', value: {}}]

export default function deserialize (value) {
  const onlyItems = omit(value, '_order')
  const items = map(onlyItems, (item, key) => ({ key, item }))

  return sortBy(items, ({item, key}) => (
    indexOf(value._order, key)
  ))
}
