import React from 'react'
import history from '../history'

export default class Link extends React.Component {
  onLinkClick (e) {
    e.preventDefault()
    history.push(e.currentTarget.pathname)
  }

  render () {
    return (
      <a onClick={this.onLinkClick.bind(this)} {...this.props} />
    )
  }
}
