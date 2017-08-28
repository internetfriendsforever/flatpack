import React from 'react'
import styled, { css } from 'styled-components'

const Box = styled.div`
  position: relative;
  display: block;
  border: 1px solid rgba(0, 0, 0, 0.2);
  margin: 1em 0;
  background: white;
  border-radius: 2px;
  padding: 0.5em 0.75em;

  ${props => props.disabled && css`
    opacity: 0.4;
  `}
`

const Title = styled.div`
  font-size: 0.65em;
  font-weight: normal;
  text-transform: uppercase;
  letter-spacing: 0.082em;
  color: #888;
`

export default ({ children, ...props }) => (
  <Box {...props}>
    {props.title && <Title>{props.title}</Title>}
    {children}
  </Box>
)
