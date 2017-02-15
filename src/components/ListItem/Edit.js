import React from 'react'
import { SortableElement } from 'react-sortable-hoc'

import DOMComponent from '../DOMComponent'

const styles = {
  container: {
    position: 'relative',
    border: '1px blue solid'
  },

  removeButton: {
    position: 'absolute',
    top: 0,
    right: 0
  }
}

class EditListItem extends React.Component {
  static propTypes = {
    attrs: React.PropTypes.object,
    onRemove: React.PropTypes.func,
    children: React.PropTypes.any
  }

  static defaultProps = {
    attrs: {}
  }

  render () {
    const { onRemove } = this.props

    const style = {
      ...styles.container,
      ...this.props.attrs.style
    }

    const attrs = {
      ...this.props.attrs,
      style
    }

    return (
      <DOMComponent {...this.props} attrs={attrs}>
        {this.props.children}

        <button style={styles.removeButton} onClick={onRemove}>
          Remove
        </button>
      </DOMComponent>
    )
  }
}

export default SortableElement(EditListItem)
