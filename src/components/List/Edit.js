import React from 'react'
import { map } from 'lodash'

import EditItem from './EditItem'

const styles = {
  container: {
    position: 'relative'
  },

  addContainer: {
    position: 'relative'
  },

  addPlaceholder: {
    visibility: 'hidden',
    pointerEvents: 'none'
  },

  addButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: 0
  }
}

styles.remove = {
  ...styles.input,
  top: 0,
  right: 0,
  left: 'auto'
}

export default class EditList extends React.Component {
  static propTypes = {
    value: React.PropTypes.object,
    setValue: React.PropTypes.func.isRequired,
    children: React.PropTypes.func
  }

  static defaultProps = {
    value: {}
  }

  state = {
    selected: null
  }

  onSelectItem (key) {
    this.setState({
      selected: key
    })
  }

  onDeselectItem (key) {
    if (key === this.state.selected) {
      this.setState({
        selected: null
      })
    }
  }

  onAddClick () {
    const key = Date.now()
    const modified = { ...this.props.value, [key]: {} }
    this.props.setValue(modified)
  }

  onRemoveItem (key) {
    const modified = { ...this.props.value }
    delete modified[key]
    this.props.setValue(modified)
  }

  render () {
    const { selected } = this.state
    const render = this.props.children

    return (
      <div style={styles.container}>
        {map(this.props.value, (value, key) => (
          <EditItem
            key={key}
            selected={selected === key}
            render={() => render(key)}
            onSelect={() => this.onSelectItem(key)}
            onDeselect={() => this.onDeselectItem(key)}
            onRemove={() => this.onRemoveItem(key)}
          />
        ))}

        <div style={styles.addContainer}>
          <div style={styles.addPlaceholder}>
            {render('new')}
          </div>

          <button style={styles.addButton} onClick={::this.onAddClick}>
            Add
          </button>
        </div>
      </div>
    )
  }
}
