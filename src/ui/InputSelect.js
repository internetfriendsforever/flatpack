import React from 'react'
import styled from 'styled-components'
import Box from './Box'

const Select = styled.select`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
`

const Display = styled.div`
  font-size: inherit;
  line-height: 1.4em;
  box-sizing: border-box;
  padding: 0.25em 0;
`

export default ({ label, display, ...props }) => {
  return (
    <label>
      <Box title={label} disabled={props.disabled}>
        <Display>{display || props.value}</Display>
        <Select {...props} />
      </Box>
    </label>
  )
}
