export const set = (path, value) => ({
  type: 'SET',
  path,
  value
})

export const discard = () => ({
  type: 'DISCARD'
})
