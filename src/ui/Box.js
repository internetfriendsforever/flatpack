import React from 'react'
import styled, { css } from 'styled-components'

const Box = styled.div`
  position: relative;
  display: block;
  border: 1px solid rgba(0, 0, 0, 0.15);
  background: white;
  border-radius: 2px;
  padding: 0.75em;
  margin-bottom: 0.75em;

  ${props => props.title && css`
    padding-top: 1.35em;
    padding-bottom: 0.5em;
  `}

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
  position: absolute;
  top: calc(0.7em / 0.65);
  left: calc(0.75em / 0.65);
`

export default ({ children, ...props }) => (
  <Box {...props}>
    {props.title && <Title>{props.title}</Title>}
    {children}
  </Box>
)
