import React from 'react'

import { colors } from './constants'

const styles = {
  container: {
    display: 'block',
    position: 'relative',
    border: '1px solid',
    borderColor: colors.input.border,
    borderRadius: 2,
    margin: '0.75em 0',
    lineHeight: 1,
    background: colors.input.background
  },

  input: {
    fontSize: '1em',
    padding: '1.25em 0.5em 0.5em',
    border: 0,
    outline: 0,
    color: colors.input.text,
    background: 'transparent',
    width: '100%'
  },

  label: {
    position: 'absolute',
    top: '0.925em',
    left: '0.5em',
    color: colors.input.label,
    pointerEvents: 'none'
  },

  labelSmall: {
    fontSize: '0.65em',
    top: '0.7em',
    left: '0.8em',
    textTransform: 'uppercase',
    fontWeight: 500,
    letterSpacing: '0.082em'
  },

  labelFocused: {
    color: colors.input.focused
  },

  containerFocused: {
    borderColor: colors.input.focused,
    background: colors.input.backgroundFocused
  }
}

export default class Input extends React.Component {

  static propTypes = {
    label: React.PropTypes.string,
    onChange: React.PropTypes.func.isRequired,
    value: React.PropTypes.string.isRequired,
    mask: React.PropTypes.bool,
    name: React.PropTypes.string,
    type: React.PropTypes.string
  }

  static defaultProps = {
    type: 'text'
  }

  state = {
    focused: false
  }

  onToggleFocus (e) {
    this.setState({
      focused: e.target === document.activeElement
    })
  }

  render () {
    const { label, onChange, value, mask, name, type } = this.props

    const { focused } = this.state

    const containerStyle = {
      ...styles.container,
      ...(focused && styles.containerFocused)
    }

    const labelStyle = {
      ...styles.label,
      ...(focused && styles.labelFocused),
      ...((focused || value) && styles.labelSmall)
    }

    return (
      <label style={containerStyle}>
        <div style={labelStyle}>{label}</div>
        <input
          name={name}
          style={styles.input}
          type={mask ? 'password' : type}
          value={value}
          onChange={onChange}
          onFocus={::this.onToggleFocus}
          onBlur={::this.onToggleFocus}
          onInput={::this.onToggleFocus}
        />
      </label>
    )
  }
}
