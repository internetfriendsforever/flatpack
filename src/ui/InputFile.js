import React from 'react'
import styled from 'styled-components'
import Box from './Box'

const File = styled.input.attrs({
  type: 'file'
})`
  fontSize: inherit;
  margin: 0.25em;
`

export default ({ label, ...props }) => {
  return (
    <label>
      <Box title={label}>
        <File {...props} />
      </Box>
    </label>
  )
}
