import React from 'react'

import { colors } from './constants'

const styles = {
  button: {
    display: 'inline-block',
    verticalAlign: 'middle',
    border: 0,
    color: 'white',
    fontSize: '1em',
    padding: '0.6em 1em',
    background: colors.button.background,
    boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.15)',
    boxSizing: 'border-box',
    borderRadius: 1,
    outline: 0,
    cursor: 'pointer',
    margin: '0.5em 0.25em'
  },

  buttonSecondary: {
    background: 'rgba(255, 255, 255, 0.12)',
    boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.2)'
  },

  block: {
    display: 'block',
    width: '100%',
    margin: '0.5em 0'
  },

  hover: {
    primary: {
      background: colors.button.backgroundHover
    },

    secondary: {
      background: 'rgba(255, 255, 255, 0.15)'
    }
  },

  pressed: {
    primary: {
      background: colors.button.backgroundPressed,
      boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.2), inset 0 3px 0 0 rgba(0, 0, 0, 0.2)'
    },

    secondary: {
      background: 'rgba(255, 255, 255, 0.1)',
      boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.2), inset 0 3px 0 0 rgba(0, 0, 0, 0.2)'
    }
  },

  inverted: {
    color: 'black'
  }
}

export default class Button extends React.Component {

  static propTypes = {
    label: React.PropTypes.string,
    submit: React.PropTypes.bool,
    onClick: React.PropTypes.func,
    block: React.PropTypes.bool,
    secondary: React.PropTypes.bool,
    inverted: React.PropTypes.bool,
    style: React.PropTypes.object
  }

  constructor (props) {
    super(props)

    this.onMouseUp = ::this.onMouseUp

    this.state = {
      focused: false,
      hover: false,
      pressed: false
    }
  }

  toggleFocus () {
    this.setState({
      focused: !this.state.focused
    })
  }

  toggleHover () {
    this.setState({
      focused: !this.state.focused,
      hover: !this.state.hover
    })
  }

  onMouseDown () {
    this.setState({
      pressed: true
    })

    document.addEventListener('mouseup', this.onMouseUp)
  }

  onMouseUp () {
    this.setState({
      pressed: false
    })

    document.removeEventListener('mouseup', this.onMouseUp)
  }

  render () {
    const { hover, pressed } = this.state
    const { label, submit, block, onClick, secondary, inverted } = this.props

    const buttonStyle = {
      ...styles.button,
      ...(secondary && styles.buttonSecondary),
      ...(hover && styles.hover[secondary ? 'secondary' : 'primary']),
      ...(hover && pressed && styles.pressed[secondary ? 'secondary' : 'primary']),
      ...(block && styles.block),
      ...(inverted && styles.inverted),
      ...this.props.style
    }

    const props = {
      style: buttonStyle,
      onMouseDown: ::this.onMouseDown,
      onMouseUp: ::this.onMouseUp,
      onMouseEnter: ::this.toggleHover,
      onMouseLeave: ::this.toggleHover,
      onFocus: ::this.toggleFocus,
      onBlur: ::this.toggleFocus,
      onClick: onClick
    }

    if (submit) {
      return (
        <input type='submit' value={label} {...props} />
      )
    } else {
      return (
        <button {...props}>
          {label}
        </button>
      )
    }
  }
}
