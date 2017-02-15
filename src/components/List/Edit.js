import React from 'react'
import { map } from 'lodash'

import EditItem from './EditItem'

const styles = {
  container: {
    position: 'relative'
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

        <button onClick={::this.onAddClick}>
          Add
        </button>
      </div>
    )
  }
}
