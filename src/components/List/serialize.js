import { map, mapValues, keyBy } from 'lodash'

// Serialized (stored) state:
// { _order: ['a', 'b'], a: {}, b: {}}

export default function serialize (value) {
  const order = map(value, ({ key }) => key)
  const items = mapValues(keyBy(value, 'key'), 'item')

  return {
    _order: order,
    ...items
  }
}
