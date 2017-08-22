import React from 'react'
import Box from './Box'

const styles = {
  display: {
    fontSize: 'inherit',
    lineHeight: '1.4em',
    boxSizing: 'border-box',
    padding: '0.25em 0'
  },

  select: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0
  }
}

export default props => (
  <label>
    <Box title={props.label} disabled={props.disabled}>
      <div style={styles.display}>{props.display || props.value}</div>
      <select style={styles.select} {...props} />
    </Box>
  </label>
)
