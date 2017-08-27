import React from 'react'
import Box from '../../ui/Box'
import Fields from '../../components/Fields'
import FieldLink from '../../components/FieldLink'

const initialValue = {}

export default ({ path = '', value = initialValue, onChange, fields, label }) => (
  <Fields path={path} fields={fields} value={value} onChange={onChange} />
)

export const field = ({ path, value = initialValue, onChange, fields, label }) => (
  <FieldLink path={path}>
    <Box>
      <div>{label || 'Group'}</div>
    </Box>
  </FieldLink>
)
