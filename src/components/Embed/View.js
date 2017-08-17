import React from 'react'

import ContentContainer from '../ContentContainer'

export default ContentContainer(({ value, placeholder }) => {
  if (!value) return null

  const embeddedHtml = () => ({ __html: value })

  return (
    <div dangerouslySetInnerHTML={embeddedHtml()} />
  )
})
