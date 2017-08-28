import React from 'react'
import styled, { css } from 'styled-components'

const shared = css`
  display: block;
  font-family: inherit;
  font-size: inherit;
  lineHeight: 1.4em;
  width: 100%;
  boxSizing: border-box;
  padding: 0.75em;
  border: 0;
  background: #333;
  fontWeight: bold;
  color: white;
  cursor: pointer;

  ${props => props.primary && css`
    background: rgb(36, 178, 161);
  `}

  ${props => props.disabled && css`
    pointer-events: none;
    background: #ccc;
  `}

  ${props => props.loading && css`
    cursor: wait;
    background: #ccc;
  `}
`

const Submit = styled.input.attrs({ type: 'submit' })`${shared}`

const Button = styled.button`${shared}`

export default ({ submit, children, ...props }) => submit ? (
  <Submit
    value={children}
    {...props}
  />
) : (
  <Button {...props}>
    {children}
  </Button>
)
