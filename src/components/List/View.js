import React from 'react'
import { map } from 'lodash'

import deserialize from './deserialize'
import ContentContainer from '../ContentContainer'
import DOMComponent from '../DOMComponent'

class ViewList extends React.Component {
  static propTypes = {
    value: React.PropTypes.object,
    children: React.PropTypes.func.isRequired
  }

  render () {
    const { value, children } = this.props

    const items = deserialize(value)

    return (
      <DOMComponent {...this.props}>
        {map(items, ({ item, key }, i) => children(key, item, i))}
      </DOMComponent>
    )
  }
}

export default ContentContainer(ViewList)
