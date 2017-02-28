export const set = (path, value) => ({
  type: 'SET',
  path,
  value
})

export const setImageUpload = (contentPath, file) => dispatch => {
  const filePath = `uploads/${Date.now()}`

  dispatch({
    type: 'SET_FILE_UPLOAD',
    key: contentPath,
    payload: {
      path: filePath,
      type: file.type,
      data: file
    }
  })

  dispatch(set(contentPath, {
    url: `/${filePath}`
  }))

  const reader = new window.FileReader()

  reader.addEventListener('load', e => {
    dispatch({
      type: 'SET_FILE_UPLOAD_PREVIEW',
      key: contentPath,
      preview: e.target.result
    })
  })

  reader.readAsDataURL(file)
}

export const discard = () => ({
  type: 'DISCARD'
})
