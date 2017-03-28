import React from 'react'

import ContentContainer from '../ContentContainer'

export default ContentContainer(({ value, placeholder }) => {
  if (!value && !placeholder) return null

  return (
    <span>{value || placeholder}</span>
  )
})
