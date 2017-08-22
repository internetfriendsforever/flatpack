import React, { Component } from 'react'
import Box from './Box'

const styles = {
  input: {
    display: 'block',
    fontSize: 'inherit',
    lineHeight: '1.4',
    width: '100%',
    boxSizing: 'border-box',
    padding: '0.5em 0',
    border: 0,
    background: 'transparent',
    outline: 'none'
  }
}

export default class extends Component {
  componentDidMount () {
    this.forceUpdate()
  }

  render () {
    const { label, ...props } = this.props

    return (
      <label>
        <Box title={label} disabled={props.disabled}>
          <input type='email' style={styles.input} {...props} />
        </Box>
      </label>
    )
  }
}
