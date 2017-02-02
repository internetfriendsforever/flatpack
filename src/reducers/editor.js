const initialState = {
  editing: false,
  publishing: false,
  building: false,
  uploading: false,
  releasing: false
}

export default function app (state = initialState, action) {
  switch (action.type) {
    case 'TOGGLE_EDITING':
      return {
        ...state,
        editing: !state.editing
      }

    case 'PUBLISH':
      return {
        ...state,
        publishing: true,
        editing: false
      }

    case 'PUBLISH_SUCCESS':
      return {
        ...state,
        publishing: false
      }

    case 'BUILD':
      return {
        ...state,
        building: true
      }

    case 'BUILD_SUCCESS':
      return {
        ...state,
        building: false
      }

    case 'UPLOAD':
      return {
        ...state,
        uploading: true
      }

    case 'UPLOAD_SUCCESS':
      return {
        ...state,
        uploading: false
      }

    case 'RELEASE':
      return {
        ...state,
        releasing: true
      }

    case 'RELEASE_SUCCESS':
      return {
        ...state,
        releasing: false
      }
  }

  return state
}
