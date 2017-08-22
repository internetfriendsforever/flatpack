import React from 'react'
import { map } from 'lodash'
import InputSelect from '../../ui/InputSelect'

export default ({ value, onChange, children, options }) => {
  const defaultValue = '/'
  const val = value || defaultValue
  const label = options[val]

  return (
    <InputSelect label='Page' display={label} value={val} onChange={e => onChange(e.currentTarget.value)}>
      {map(options, (label, path) => (
        <option key={path} value={path}>
          {label}
        </option>
      ))}
    </InputSelect>
  )
}
