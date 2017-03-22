import React from 'react'

export default class Link extends React.Component {
  static propTypes = {
    onClick: React.PropTypes.func
  }

  static contextTypes = {
    flatpack: React.PropTypes.object
  }

  onClick (e) {
    e.preventDefault()

    this.context.flatpack.history.push(e.currentTarget.pathname)

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
