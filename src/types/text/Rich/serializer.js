import React from 'react'
import Html from 'slate-html-serializer'

const BLOCK_TAGS = {
  p: 'paragraph',
  li: 'list-item',
  ul: 'bullet-list',
  ol: 'number-list',
  h1: 'heading-1',
  h2: 'heading-2'
}

const MARK_TAGS = {
  b: 'bold',
  i: 'italic'
}

export default new Html({
  rules: [{
    serialize (object, children) {
      if (object.kind !== 'block') return
      switch (object.type) {
        case 'paragraph': return <p>{children}</p>
        case 'heading-1': return <h1>{children}</h1>
        case 'heading-2': return <h2>{children}</h2>
        case 'bullet-list': return <ul>{children}</ul>
        case 'number-list': return <ol>{children}</ol>
        case 'list-item': return <li>{children}</li>
      }
    },

    deserialize (el, next) {
      const block = BLOCK_TAGS[el.tagName.toLowerCase()]
      if (!block) return
      return {
        kind: 'block',
        type: block,
        nodes: next(el.childNodes)
      }
    }
  }, {
    serialize (object, children) {
      if (object.kind !== 'mark') return
      switch (object.type) {
        case 'bold': return <b>{children}</b>
        case 'italic': return <i>{children}</i>
      }
    },

    deserialize (el, next) {
      const mark = MARK_TAGS[el.tagName.toLowerCase()]
      if (!mark) return
      return {
        kind: 'mark',
        type: mark,
        nodes: next(el.childNodes)
      }
    }
  }]
})
