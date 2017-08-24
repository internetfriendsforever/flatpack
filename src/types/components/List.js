import React from 'react'
import Box from '../../ui/Box'
import Fields from '../../components/Fields'
import FieldLink from '../../components/FieldLink'

const initialValue = []

export default ({ value = initialValue, onChange, display, fields, label }) => {
  return (
    <Box title={label || 'List'}>
      <button onClick={() => {
        onChange([
          ...value,
          {}
        ])
      }}>
        Add
      </button>

      {value.map((item, i) => (
        <div key={i}>
          <Fields fields={fields} value={item} onChange={modified => {
            const items = value
            items[i] = modified
            onChange(items)
          }} />

          <button onClick={() => {
            const items = value
            items.splice(i, 1)
            onChange(items)
          }}>
            Remove
          </button>
        </div>
      ))}
    </Box>
  )
}

export const field = ({ value = initialValue, path, onChange, display, fields, label }) => (
  <FieldLink path={path}>
    <Box>
      <div>{label || 'Group'}</div>
    </Box>
  </FieldLink>
)
