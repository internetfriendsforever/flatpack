import React from 'react'

import { colors } from './constants'

const styles = {
  container: {
    position: 'fixed',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    left: 0,
    right: 0,
    height: 50,
    zIndex: 20,
    background: colors.darkSlate
  }
}

export default class Message extends React.Component {
  static propTypes = {
    children: React.PropTypes.any
  }

  render () {
    const { children } = this.props

    return (
      <div style={styles.container}>
        {children}
      </div>
    )
  }
}
