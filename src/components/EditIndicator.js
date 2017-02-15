import React from 'react'

const styles = {
  container: {
    position: 'relative'
  },

  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    boxShadow: '0 0 0 1px rgba(255, 210, 0, 0.5)',
    background: 'rgba(255, 210, 0, 0.1)',
    pointerEvents: 'none'
  }
}

export default class Editable extends React.Component {
  static propTypes = {
    children: React.PropTypes.node
  }

  render () {
    return (
      <div style={styles.container}>
        {this.props.children}
        <div style={styles.overlay} />
      </div>
    )
  }
}
