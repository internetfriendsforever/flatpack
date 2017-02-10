import React from 'react'
import { map } from 'lodash'

export default ({ value }) => (
  <div>
    {map(value, (item, key) => (
      <div>
        {this.props.children(item, key)}
      </div>
    ))}
  </div>
)
