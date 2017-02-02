const initialState = {
  administrate: false
}

export default function app (state = initialState, action) {
  switch (action.type) {
    case 'TOGGLE_ADMINISTRATE':
      return {
        ...state,
        administrate: action.administrate
      }
  }

  return state
}
