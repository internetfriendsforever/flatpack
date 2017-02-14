import React from 'react'
import { map } from 'lodash'

export default class View extends React.Component {
  static propTypes = {
    value: React.PropTypes.object,
    children: React.PropTypes.func.isRequired,
    component: React.PropTypes.string.isRequired
  }

  static defaultProps = {
    component: 'div'
  }

  render () {
    const { value, children, component } = this.props

    return React.createElement(component, {
      children: map(value, (item, key) => children(key))
    })
  }
}
