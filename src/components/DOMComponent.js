import React from 'react'

export default class DOMComponent extends React.Component {
  static propTypes = {
    component: React.PropTypes.string.isRequired,
    attrs: React.PropTypes.object.isRequired,
    children: React.PropTypes.any
  }

  static defaultProps = {
    component: 'div',
    attrs: {}
  }

  render () {
    const { component, attrs, children } = this.props
    return React.createElement(component, attrs, children)
  }
}
