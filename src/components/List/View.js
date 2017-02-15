import React from 'react'
import { map, omit } from 'lodash'

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

    const items = omit(value, '_order')

    return React.createElement(component, {
      children: map(items, (item, key) => children(key))
    })
  }
}
