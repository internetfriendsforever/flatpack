import styled, { css } from 'styled-components'

export default styled.div`
  background: #E4FCFA;
  border-radius: 2;
  lineHeight: 1.4;
  padding: 0.75em;
  margin: 1em 0;

  ${props => props.warn && css`
    background: #FCEDE4;
  `}

  ${props => props.critical && css`
    background: #FFD5D5;
  `}
`
