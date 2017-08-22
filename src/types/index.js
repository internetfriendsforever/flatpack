import { zipObject } from 'lodash'

// Get files from ./fields
const typeContext = require.context('./Components', false, /\.js$/)

// Map files to keys ./Text.js -> text
const typeKeys = typeContext.keys().map(key => (
  key.substring(2).replace(/\.js$/, '').toLowerCase()
))

// Make type creator (props => { Component: require('./types/Text.js'), ...props } }
const typeCreators = typeContext.keys().map(key => props => ({
  Component: typeContext(key).default,
  ...props
}))

// Export types as { text: typeCreator }
export default zipObject(typeKeys, typeCreators)
