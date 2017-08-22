import React from 'react'
import InputFile from '../../ui/InputFile'

export default ({ value, onChange, label }) => (
  <InputFile
    label={label || 'Image'}
    onChange={e => onChange(e.currentTarget.value)}
  />
)
