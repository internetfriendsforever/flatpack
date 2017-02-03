const initialState = {
  editor: false
}

export default function app (state = initialState, action) {
  switch (action.type) {
    case 'TOGGLE_EDITOR':
      return {
        ...state,
        editor: action.state
      }
  }

  return state
}
