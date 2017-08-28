import React from 'react'
import { findDOMNode } from 'react-dom'
import autosize from 'autosize'
import styled from 'styled-components'
import Box from './Box'

const Textarea = styled.textarea`
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
        <Textarea rows='1' {...props} ref={node => {
          if (node) {
            autosize(findDOMNode(node))
          }
        }} />
      </Box>
    </label>
  )
}
