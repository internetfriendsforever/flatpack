import React from 'react'
import { map, sortBy, keyBy, mapValues, omit, indexOf } from 'lodash'
import { arrayMove } from 'react-sortable-hoc'

import ListContainer from './ListContainer'
import ContentContainer from '../ContentContainer'

/*
  Serialized (stored) state:
  { _order: ['a', 'b'], a: {}, b: {}}

  Deserialized (internal) state:
  [{ key: 'a', value: {}}, { key: 'b', value: {}}]
*/

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
    const items = this.deserialize(this.props.value)
    const sorted = arrayMove(items, oldIndex, newIndex)

    this.props.setValue(this.serialize(sorted))
  }

  serialize (value) {
    const order = map(value, ({ key }) => key)
    const items = mapValues(keyBy(value, 'key'), 'item')

    return {
      _order: order,
      ...items
    }
  }

  deserialize (value) {
    const onlyItems = omit(value, '_order')
    const items = map(onlyItems, (item, key) => ({ key, item }))

    return sortBy(items, ({item, key}) => (
      indexOf(value._order, key)
    ))
  }

  onAddClick = () => {
    const { reverse, value } = this.props
    const modified = this.deserialize(value)

    modified[reverse ? 'unshift' : 'push']({
      key: Date.now().toString(),
      item: {}
    })

    this.props.setValue(this.serialize(modified))
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
    const items = this.deserialize(value)

    return map(items, ({ item, key }, index) => {
      const child = render(key)

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
      <ListContainer
        {...this.props}
        attrs={attrs}
        onSortEnd={this.onSortEnd}
        shouldCancelStart={this.shouldCancelStart}
        distance={10}
      >
        {this.renderChildren()}
        {this.renderAddButton()}
      </ListContainer>
    )
  }
}

export default ContentContainer(EditList)
