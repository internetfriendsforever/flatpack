import React from 'react'

import ContentContainer from '../ContentContainer'

export default ContentContainer(({ value }) => {
  if (!value) return null

  return (
    <span>{value}</span>
  )
})
