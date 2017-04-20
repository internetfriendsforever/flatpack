import React from 'react'

import ContentContainer from '../ContentContainer'

export default ContentContainer(({ value, placeholder }) => {
  if (!value) return null

  return (
    <span>{value}</span>
  )
})
