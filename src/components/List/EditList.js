import React from 'react'
import { map } from 'lodash'
import { SortableContainer } from 'react-sortable-hoc'

import EditItem from './EditItem'

class EditList extends React.Component {
  static propTypes = {
    items: React.PropTypes.array,
    render: React.PropTypes.func.isRequired,
    onRemoveItem: React.PropTypes.func.isRequired
  }

  render () {
    const { items, render, onRemoveItem } = this.props

    return (
      <div>
        {map(items, ({ key, item }, index) => (
          <EditItem
            key={`item-${index}`}
            index={index}
            render={() => render(key)}
            onRemove={() => onRemoveItem(key)}
          />
        ))}
      </div>
    )
  }
}

export default SortableContainer(EditList)
