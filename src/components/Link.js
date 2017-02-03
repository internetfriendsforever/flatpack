import React from 'react'
import history from '../history'

export default class Link extends React.Component {
  static propTypes = {
    onClick: React.PropTypes.func
  }

  onClick (e) {
    e.preventDefault()
    history.push(e.currentTarget.pathname)

    if (this.props.onClick) {
      this.props.onClick(e)
    }
  }

  render () {
    return (
      <a onClick={::this.onClick} {...this.props} />
    )
  }
}
