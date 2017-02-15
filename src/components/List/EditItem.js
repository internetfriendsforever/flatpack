import React from 'react'
import { findDOMNode } from 'react-dom'

import EditIndicator from '../EditIndicator'

const styles = {
  container: {
    position: 'relative'
  },

  selected: {
  },

  removeButton: {
    position: 'absolute',
    top: 0,
    right: 0
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
      <EditIndicator>
        <div style={style} onMouseDown={::this.onMouseDown}>
          {render()}

          <button style={styles.removeButton} onClick={onRemove}>
            Remove
          </button>
        </div>
      </EditIndicator>
    )
  }
}
