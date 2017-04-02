import React from 'react'
import { omit } from 'lodash'

export default class Link extends React.Component {
  static propTypes = {
    href: React.PropTypes.string,
    onClick: React.PropTypes.func,
    activeFunc: React.PropTypes.func,
    activeAttrs: React.PropTypes.object
  }

  static defaultProps = {
    activeFunc: (href, history) => (
      href === history.location.pathname
    ),

    activeAttrs: {
      className: 'active'
    }
  }

  static contextTypes = {
    flatpack: React.PropTypes.object
  }

  onClick (e) {
    e.preventDefault()

    window.scrollTo(0, 0)

    this.context.flatpack.history.push(e.currentTarget.pathname)

    if (this.props.onClick) {
      this.props.onClick(e)
    }
  }

  render () {
    const { history } = this.context.flatpack
    const { activeAttrs, activeFunc } = this.props
    const active = activeFunc(this.props.href, history)

    const attrs = {
      ...omit(this.props, 'activeAttrs', 'activeFunc'),
      ...(active && activeAttrs)
    }

    return (
      <a onClick={::this.onClick} {...attrs} />
    )
  }
}
