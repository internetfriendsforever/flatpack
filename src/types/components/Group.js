import React from 'react'
import Box from '../../ui/Box'
import Fields from '../../components/Fields'

const initialValue = {}

export default ({ value = initialValue, onChange, display, fields, label }) => (
  <Box title={label || 'Group'}>
    <Fields fields={fields} value={value} onChange={onChange} />
  </Box>
)
