import React from 'react'
import { map, sortBy, keyBy, mapValues, omit, indexOf } from 'lodash'
import { arrayMove } from 'react-sortable-hoc'

import EditList from './EditList'

export default class Edit extends React.Component {
  static propTypes = {
    value: React.PropTypes.object,
    setValue: React.PropTypes.func.isRequired,
    children: React.PropTypes.func.isRequired,
    reverse: React.PropTypes.bool
  }

  static defaultProps = {
    value: {},
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

    console.log(order)

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

  renderAddButton () {
    return (
      <button onClick={this.onAddClick}>
        Add
      </button>
    )
  }

  render () {
    const { value, reverse } = this.props

    return (
      <div>
        {reverse && this.renderAddButton()}

        <EditList
          items={this.deserialize(value)}
          render={this.props.children}
          onSortEnd={this.onSortEnd}
          onRemoveItem={this.onRemoveItem}
        />

        {!reverse && this.renderAddButton()}
      </div>
    )
  }
}
