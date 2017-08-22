import React from 'react'
import Box from './Box'

const styles = {
  input: {
    fontSize: 'inherit',
    margin: '0.25em'
  }
}

export default props => (
  <label>
    <Box title={props.label} disabled={props.disabled}>
      <input type='file' style={styles.input} {...props} />
    </Box>
  </label>
)
