import React from 'react'
import ReactDOM from 'react-dom'
import types from '../types'
import Editor from '../components/Editor'

export default ({ value, aws, fields, router }) => {
  const container = document.createElement('div')

  ReactDOM.render((
    <Editor aws={aws} value={value} fields={fields(types)} router={router} />
  ), container)

  document.body.appendChild(container)
}
