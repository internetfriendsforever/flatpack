import React from 'react'
import { map } from 'lodash'

const styles = {
  container: {
    position: 'relative'
  },

  input: {
    position: 'absolute',
    left: 0,
    bottom: -20,
    cursor: 'pointer',
    background: 'black',
    color: 'white',
    borderRadius: '50%',
    width: 20,
    height: 20,
    lineHeight: '20px',
    textAlign: 'center',
    zIndex: 100
  },

  item: {
    position: 'relative'
  }
}

styles.remove = {
  ...styles.input,
  top: 0,
  right: 0,
  left: 'auto'
}

export default class List extends React.Component {
  static propTypes = {
    value: React.PropTypes.object,
    setValue: React.PropTypes.func.isRequired,
    children: React.PropTypes.func
  }

  static defaultProps = {
    value: {}
  }

  onAddClick () {
    const modified = {
      ...this.props.value,
      [Date.now()]: {}
    }

    this.props.setValue(modified)
  }

  onRemoveItemClick (key) {
    const modified = {
      ...this.props.value
    }

    delete modified[key]

    this.props.setValue(modified)
  }

  render () {
    return (
      <div style={styles.container}>
        {map(this.props.value, (item, key) => (
          <div style={styles.item} key={key}>
            {this.props.children(item, key)}

            <div
              style={styles.remove}
              onClick={() => this.onRemoveItemClick(key)}
              children='−'
            />
          </div>
        ))}

        <div style={styles.input}>
          <div onClick={::this.onAddClick}>+</div>
        </div>
      </div>
    )
  }
}
