import React from 'react'
import Box from '../../ui/Box'
import Group from './Group'
import PathLink from '../../components/PathLink'
import PathBreadcrumbs from '../../components/PathBreadcrumbs'

const initialValue = []

export default ({ segments, resolved, value = initialValue, onChange, display, fields, label, itemLabel }) => {
  if (segments.length > resolved.length) {
    const key = segments[resolved.length]
    const item = value[key]
    const index = parseInt(key, 10)
    const label = itemLabel && itemLabel(item) || `Item ${key}`

    resolved.push(label)

    return (
      <div>
        <Group
          segments={segments}
          resolved={resolved}
          fields={fields}
          value={item}
          onChange={modified => {
            const nextValue = [...value]
            nextValue[index] = modified
            onChange(nextValue)
          }}
        />

        {segments.length === resolved.length && (
          <button onClick={() => console.log('Remove')}>Remove</button>
        )}
      </div>
    )
  }

  return (
    <div>
      <PathBreadcrumbs segments={segments} resolved={resolved} />

      <Box title={label || 'List'}>
        <button onClick={() => {
          onChange([ ...value, {} ])
        }}>
          Add
        </button>

        {value.map((item, i) => (
          <div key={i}>
            <PathLink path={[...segments, i].join('/')}>
              {itemLabel && itemLabel(item) || `Item ${i}`}
            </PathLink>
          </div>
        ))}
      </Box>
    </div>
  )
}

export const field = ({ path, segments, value = initialValue, onChange, fields, label }) => {
  return (
    <PathLink path={[...segments, path].join('/')}>
      <Box>
        <div>{label || 'List'}</div>
      </Box>
    </PathLink>
  )
}
