import React from 'react'
import InputFile from '../ui/InputFile'
import createType from './createType'

const Edit = ({ value, onChange, label }) => (
  <InputFile
    label={label || 'Image'}
    onChange={e => onChange(e.currentTarget.value)}
  />
)

export default createType({ Edit })
