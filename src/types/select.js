import React from 'react'
import map from 'lodash/map'
import InputSelect from '../ui/InputSelect'
import createType from './createType'

const Edit = ({ value, onChange, options, label }) => {
  const defaultValue = ''
  const val = value || defaultValue
  const display = options[val]

  return (
    <InputSelect label={label || 'Select'} display={display} value={val} onChange={e => onChange(e.currentTarget.value)}>
      {map(options, (label, path) => (
        <option key={path} value={path}>
          {label}
        </option>
      ))}
    </InputSelect>
  )
}

export default createType({ Edit })
