import React from 'react'

import { colors } from './constants'

const styles = {
  header: {
    margin: '0 0 3em',
    fontWeight: 'normal',
    color: colors.slate
  }
}

export default class WindowHeader extends React.Component {
  static propTypes = {
    children: React.PropTypes.any
  }

  render () {
    const { children } = this.props

    return (
      <h3 style={styles.header}>
        {children}
      </h3>
    )
  }
}
