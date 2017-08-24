import React from 'react'
import ReactDOM from 'react-dom'
import types from '../types'
import Editor from '../components/Editor'

let container

export default ({ fields, ...props }) => {
  if (!container) {
    container = document.createElement('div')
    document.body.appendChild(container)
  }

  ReactDOM.render((
    <Editor fields={fields(types)} {...props} />
  ), container)
}
