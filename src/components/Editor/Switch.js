import React from 'react'

import { colors } from './constants'

const width = '2.8em'
const height = '1.7em'
const knobMargin = 4

const styles = {
  container: {
    padding: '0.5em 0',
    margin: '0.3em',
    cursor: 'pointer',
    userSelect: 'none',
    display: 'inline-block'
  },

  switch: {
    background: colors.switch.background,
    boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.2)',
    width: width,
    height: height,
    borderRadius: height,
    display: 'inline-block',
    verticalAlign: 'middle',
    position: 'relative',
    marginTop: '-0.15em'
  },

  switchActive: {
    background: colors.switchActive.background,
    boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.6)',
    borderColor: colors.switchActive.border
  },

  knob: {
    background: colors.switch.knob.background,
    display: 'block',
    position: 'absolute',
    top: knobMargin,
    left: knobMargin,
    boxSizing: 'border-box',
    width: `calc(${height} - ${knobMargin * 2}px)`,
    height: `calc(${height} - ${knobMargin * 2}px)`,
    borderRadius: '50%',
    boxShadow: '0 0.5px 0 1px rgba(0, 0, 0, 0.3)',
    transition: 'left 0.1s ease-in 0s, background 0.1s ease-in 0s'
  },

  knobActive: {
    left: `calc(100% - ${height} + ${knobMargin}px)`
  },

  label: {
    marginLeft: '0.5em'
  }
}

export default class Switch extends React.Component {

  static propTypes = {
    label: React.PropTypes.string,
    checked: React.PropTypes.bool,
    onClick: React.PropTypes.func
  }

  static defaultProps = {
    checked: false
  }

  render () {
    const { label, onClick, checked } = this.props

    const switchStyle = {
      ...styles.switch,
      ...(checked && styles.switchActive)
    }

    const knobStyle = {
      ...styles.knob,
      ...(checked && styles.knobActive)
    }

    return (
      <div style={styles.container} onClick={onClick}>
        <span style={switchStyle}>
          <span style={knobStyle} />
        </span>
        <span style={styles.label}>
          {label}
        </span>
      </div>
    )
  }
}
