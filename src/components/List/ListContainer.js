import React from 'react'
import { SortableContainer } from 'react-sortable-hoc'

import DOMComponent from '../DOMComponent'

export default SortableContainer(props => (
  <DOMComponent {...props} />
))
