import React from 'react'

import ContentContainer from '../ContentContainer'

export default ContentContainer(({ value, components, path }) => {
  if (!value) return null

  const Component = components[value.component]

  const componentPath = `${path}/componentValue`

  return (
    <Component path={componentPath} />
  )
})
