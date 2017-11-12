export default components => (props, children) => {
  const type = { ...children }

  type.props = props

  Object.defineProperty(type, 'props', {
    writable: false,
    enumerable: false
  })

  type.components = components

  Object.defineProperty(type, 'components', {
    writable: false,
    enumerable: false
  })

  return type
}
