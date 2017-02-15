import React from 'react'
import { Raw, Html } from 'slate'

const rules = [
  {
    serialize (object, children) {
      if (object.kind !== 'block') return
      switch (object.type) {
        case 'paragraph': return <p>{children}</p>
        case 'heading1': return <h1>{children}</h1>
        case 'heading2': return <h2>{children}</h2>
        case 'heading3': return <h3>{children}</h3>
        case 'heading4': return <h4>{children}</h4>
        case 'code': return <pre><code>{children}</code></pre>
      }
    }
  },

  {
    serialize (object, children) {
      if (object.kind !== 'inline') return

      switch (object.type) {
        case 'link': return <a href={object.data.get('href')}>{children}</a>
      }
    }
  },

  {
    serialize (object, children) {
      if (object.kind !== 'mark') return
      switch (object.type) {
        case 'bold': return <b>{children}</b>
        case 'italic': return <i>{children}</i>
        case 'code': return <code>{children}</code>
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
