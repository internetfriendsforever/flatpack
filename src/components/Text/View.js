import React from 'react'
import { Plain, Raw } from 'slate'

export default ({ value }) => {
  if (value) {
    const slateState = Raw.deserialize(value, { terse: true })
    const plainText = Plain.serialize(slateState)

    return (
      <div>{ plainText }</div>
    )
  }

  return null
}
