import React from 'react'
import InputText from '../../ui/InputText'

export default ({ value, onChange, label }) => (
  <InputText
    label={label || 'Text'}
    value={value}
    onChange={e => onChange(e.currentTarget.value)}
  />
)
