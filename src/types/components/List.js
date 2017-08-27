import React from 'react'
import remove from 'lodash/remove'
import Box from '../../ui/Box'
import Fields from '../../components/Fields'
import FieldLink from '../../components/FieldLink'
import { getQuery, getQueryUrl } from '../../utils/query'

const initialValue = []

export default ({ path = '', value = initialValue, onChange, display, fields, label }) => {
  const segments = path.split('/')
  const key = segments.shift()
  const item = value[key]

  if (item) {
    const index = parseInt(key, 10)

    return (
      <div>
        <Fields
          path={segments.join('/')}
          fields={fields}
          value={item}
          onChange={modified => {
            const nextValue = [...value]
            nextValue[index] = modified
            onChange(nextValue)
          }}
        />

        {!segments.length && (
          <button onClick={() => {
            const nextPath = getQuery().path.split('/').slice(0, -1).join('/')
            const nextUrl = getQueryUrl({ ...getQuery(), path: nextPath })
            window.history.replaceState(null, null, nextUrl)
            onChange(remove(value, (item, i) => i !== index))
          }}>
            Remove
          </button>
        )}
      </div>
    )
  }

  return (
    <Box title={label || 'List'}>
      <button onClick={() => {
        onChange([ ...value, {} ])
      }}>
        Add
      </button>

      {value.map((item, i) => (
        <div key={i}>
          <FieldLink path={i}>
            Item
          </FieldLink>
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
