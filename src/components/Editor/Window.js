import React from 'react'

const styles = {
  container: {
    position: 'fixed',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'auto',
    background: 'rgba(0, 0, 0, 0.5)',
    color: 'black'
  },

  content: {
    background: 'white',
    border: '1px solid rgba(0, 0, 0, 0.6)',
    padding: '1em'
  }
}

export default class Message extends React.Component {
  static propTypes = {
    children: React.PropTypes.any,
    onExit: React.PropTypes.func
  }

  onBackgroundClick (e) {
    this.props.onExit && this.props.onExit()
  }

  onContentClick (e) {
    e.stopPropagation()
  }

  render () {
    const { children } = this.props

    return (
      <div style={styles.container} onClick={::this.onBackgroundClick}>
        <div style={styles.content} onClick={::this.onContentClick}>
          {children}
        </div>
      </div>
    )
  }
}
