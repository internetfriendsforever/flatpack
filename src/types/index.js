import zipObject from 'lodash/zipObject'

// Get files from ./fields
const typeContext = require.context('./Components', false, /\.js$/)

// Map files to keys ./Text.js -> text
const typeKeys = typeContext.keys().map(key => (
  key.substring(2).replace(/\.js$/, '').toLowerCase()
))

// Make type creator (props => { ...require('./types/Text.js'), ...props } }
const typeCreators = typeContext.keys().map(key => (props, children) => {
  const field = { ...children }

  field.props = props

  Object.defineProperty(field, 'props', {
    writable: false,
    enumerable: false
  })

  field.components = typeContext(key)

  Object.defineProperty(field, 'components', {
    writable: false,
    enumerable: false
  })

  return field
})

// (props, children) => ({
//   _components: ,
//   _props: props,
//   ...children
// }))

// Export types as { text: typeCreator }
export default zipObject(typeKeys, typeCreators)
