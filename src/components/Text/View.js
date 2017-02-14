import React from 'react'
import { Raw, Html } from 'slate'

const rules = [
  {
    serialize (object, children) {
      if (object.kind !== 'block') return
      switch (object.type) {
        case 'paragraph': return <p>{children}</p>
        case 'code': return <pre><code>{children}</code></pre>
      }
    }
  },

  {
    serialize (object, children) {
      if (object.kind !== 'mark') return
      switch (object.type) {
        case 'bold': return <b>{children}</b>
        case 'italic': return <i>{children}</i>
      }
    }
  }
]

function getHtml (state) {
  const html = new Html({ rules })
  return { __html: html.serialize(state) }
}

export default ({ value }) => {
  if (!value) return null

  const slateState = Raw.deserialize(value, { terse: true })

  return (
    <div dangerouslySetInnerHTML={getHtml(slateState)} />
  )
}
