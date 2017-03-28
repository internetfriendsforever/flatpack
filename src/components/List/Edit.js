import React from 'react'
import { map } from 'lodash'
import { arrayMove } from 'react-sortable-hoc'

import serialize from './serialize'
import deserialize from './deserialize'
import EditContainer from './EditContainer'
import ContentContainer from '../ContentContainer'

const styles = {
  container: {
    position: 'relative',
    border: '1px blue solid'
  },

  addButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    transform: 'translateY(100%)'
  },

  addButtonReverse: {
    top: 0,
    left: 0,
    bottom: 'auto',
    right: 'auto',
    transform: 'translateY(-100%)'
  }
}

function isDescendantOfContentEditable (node) {
  while (node && node.parentNode) {
    if (node.isContentEditable || node.parentNode.isContentEditable) {
      return true
    } else {
      node = node.parentNode
    }
  }
}

class EditList extends React.Component {
  static propTypes = {
    value: React.PropTypes.object,
    setValue: React.PropTypes.func.isRequired,
    children: React.PropTypes.func.isRequired,
    attrs: React.PropTypes.object,
    reverse: React.PropTypes.bool
  }

  static defaultProps = {
    value: {},
    attrs: {},
    reverse: false
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    const items = deserialize(this.props.value)
    const sorted = arrayMove(items, oldIndex, newIndex)

    this.props.setValue(serialize(sorted))
  }

  onAddClick = () => {
    const { reverse, value } = this.props
    const modified = deserialize(value)

    modified[reverse ? 'unshift' : 'push']({
      key: Date.now().toString(),
      item: {}
    })

    this.props.setValue(serialize(modified))
  }

  onRemoveItem = key => {
    const modified = { ...this.props.value }
    delete modified[key]
    this.props.setValue(modified)
  }

  shouldCancelStart = e => {
    if (isDescendantOfContentEditable(e.target)) {
      return true
    }
  }

  renderAddButton () {
    const { reverse } = this.props

    const style = {
      ...styles.addButton,
      ...(reverse && styles.addButtonReverse)
    }

    return (
      <button onClick={this.onAddClick} style={style}>
        Add
      </button>
    )
  }

  renderChildren () {
    const { value } = this.props
    const render = this.props.children
    const items = deserialize(value)

    return map(items, ({ item, key }, index) => {
      const child = render(key, item, index)

      return React.cloneElement(child, {
        ...child.props,
        index,
        onRemove: () => this.onRemoveItem(key)
      })
    })
  }

  render () {
    const style = {
      ...styles.container,
      ...this.props.attrs.style
    }

    const attrs = {
      ...this.props.attrs,
      style
    }

    return (
      <EditContainer
        {...this.props}
        attrs={attrs}
        onSortEnd={this.onSortEnd}
        shouldCancelStart={this.shouldCancelStart}
        distance={10}
      >
        {this.renderChildren()}
        {this.renderAddButton()}
      </EditContainer>
    )
  }
}

export default ContentContainer(EditList)
