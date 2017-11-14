import React from 'react'
import styled, { css } from 'styled-components'

const Box = styled.div`
  position: relative;
  display: block;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: white;
  border-radius: 2px;
  padding: 0.8em;
  margin-bottom: 5px;

  ${props => props.invert && css`
    background: rgba(255, 255, 255, 0.1);
    border: 0;
    color: #ccc;
  `}

  ${props => props.title && css`
    padding-top: 1.5em;
    padding-bottom: 0.8em;
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
  position: absolute;
  top: calc(0.9em / 0.65);
  left: calc(0.8em / 0.65);
  color: #aaa;
`

export default ({ children, title, ...props }) => (
  <Box {...props} title={title}>
    {title && (
      <Title>{title}</Title>
    )}
    {children}
  </Box>
)
