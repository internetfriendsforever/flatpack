import React from 'react'
import InputText from '../ui/InputText'
import createType from './createType'

const Edit = ({ value, onChange, label }) => (
  <InputText
    label={label || 'Text'}
    value={value}
    onChange={e => onChange(e.currentTarget.value)}
  />
)

export default createType({ Edit })
