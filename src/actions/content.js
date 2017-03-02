export const set = (path, value) => ({
  type: 'SET',
  path,
  value
})

export const setUpload = (key, { preview, files }) => ({
  type: 'SET_FILE_UPLOAD',
  key,
  preview,
  files
})

export const discard = () => ({
  type: 'DISCARD'
})
