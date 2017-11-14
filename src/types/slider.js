import React from 'react'
import Box from '../ui/Box'
import createType from './createType'

const Edit = ({ value = '', onChange, label, min = 0, max = 100 }) => (
  <Box title={label || 'Slider'}>
    <input type='range' value={value} onChange={e => onChange(e.currentTarget.value)} min={min} max={max} />
    {value}
  </Box>
)

export default createType({ Edit })
