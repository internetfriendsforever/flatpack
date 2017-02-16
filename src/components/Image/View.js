import React from 'react'

import Image from './Image'
import ContentContainer from '../ContentContainer'
import DOMComponent from '../DOMComponent'

export default ContentContainer(props => {
  return (
    <DOMComponent {...props}>
      <Image path={props.path} />
    </DOMComponent>
  )
})
