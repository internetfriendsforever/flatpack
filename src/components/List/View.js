import React from 'react'
import { map, omit } from 'lodash'

import ContentContainer from '../ContentContainer'
import DOMComponent from '../DOMComponent'

class ViewList extends React.Component {
  static propTypes = {
    value: React.PropTypes.object,
    children: React.PropTypes.func.isRequired
  }

  render () {
    const { value, children } = this.props

    const items = omit(value, '_order')

    return (
      <DOMComponent {...this.props}>
        {map(items, (item, key) => children(key))}
      </DOMComponent>
    )
  }
}

export default ContentContainer(ViewList)
