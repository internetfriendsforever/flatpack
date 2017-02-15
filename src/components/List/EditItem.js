import React from 'react'
import { SortableElement } from 'react-sortable-hoc'

import EditIndicator from '../EditIndicator'

const styles = {
  container: {
    position: 'relative'
  },

  removeButton: {
    position: 'absolute',
    top: 0,
    right: 0
  }
}

class EditItem extends React.Component {
  static propTypes = {
    render: React.PropTypes.func.isRequired,
    onRemove: React.PropTypes.func.isRequired
  }

  componentDidMount () {
    document.addEventListener('mousedown', this.checkDeselect)
  }

  componentWillUnmount () {
    document.removeEventListener('mousedown', this.checkDeselect)
  }

  render () {
    const { render, onRemove } = this.props

    return (
      <EditIndicator>
        <div style={styles.container}>
          {render()}

          <button style={styles.removeButton} onClick={onRemove}>
            Remove
          </button>
        </div>
      </EditIndicator>
    )
  }
}

export default SortableElement(EditItem)
