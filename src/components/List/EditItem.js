import React from 'react'
import { findDOMNode } from 'react-dom'

import { colors } from '../Editor/constants'

const styles = {
  container: {
    position: 'relative'
  },

  selected: {
    boxShadow: `0 0 0 2px ${colors.slate}`
  },

  removeButton: {
    display: 'none'
  },

  overlay: {
    position: 'absolute',
    display: 'block',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 3,
    background: 'rgba(255, 255, 255, 1)',
    mixBlendMode: 'overlay',
    pointerEvents: 'none'
  }
}

export default class EditItem extends React.Component {
  static propTypes = {
    selected: React.PropTypes.bool.isRequired,
    render: React.PropTypes.func.isRequired,
    onSelect: React.PropTypes.func.isRequired,
    onDeselect: React.PropTypes.func.isRequired,
    onRemove: React.PropTypes.func.isRequired
  }

  componentDidMount () {
    document.addEventListener('mousedown', this.checkDeselect)
  }

  componentWillUnmount () {
    document.removeEventListener('mousedown', this.checkDeselect)
  }

  checkDeselect = e => {
    const element = findDOMNode(this)

    if (element !== e.target && !element.contains(e.target)) {
      this.props.onDeselect()
    }
  }

  onMouseDown (e) {
    e.stopPropagation()
    this.props.onSelect()
  }

  render () {
    const { render, selected, onRemove } = this.props

    const style = {
      ...styles.container,
      ...(selected && styles.selected)
    }

    return (
      <div style={style} onMouseDown={::this.onMouseDown}>
        {render()}

        <button style={styles.removeButton} onClick={onRemove}>
          Remove
        </button>

        <div style={styles.overlay} />
      </div>
    )
  }
}
