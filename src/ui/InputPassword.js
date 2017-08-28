import React from 'react'
import styled from 'styled-components'
import Box from './Box'

const Password = styled.input.attrs({
  type: 'password'
})`
  display: block;
  font-size: inherit;
  font-family: inherit;
  lineHeight: 1.4;
  width: 100%;
  box-sizing: border-box;
  padding: 0.5em 0;
  border: 0;
  background: transparent;
  resize: none;
  outline: none;
`

export default ({ label, ...props }) => {
  return (
    <label>
      <Box title={label}>
        <Password {...props} />
      </Box>
    </label>
  )
}
