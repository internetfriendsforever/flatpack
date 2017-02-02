const initialState = {
  credentials: null,
  error: null,
  signingIn: false,
  fetchingCredentials: false
}

export default function authentication (state = initialState, action) {
  switch (action.type) {
    case 'FETCH_CREDENTIALS':
      return {
        ...state,
        fetchingCredentials: true
      }

    case 'FETCH_CREDENTIALS_SUCCESS':
      return {
        ...state,
        credentials: action.credentials,
        fetchingCredentials: false
      }

    case 'FETCH_CREDENTIALS_FAILURE':
      return {
        ...state,
        credentials: false,
        fetchingCredentials: false
      }

    case 'SIGN_IN':
      return {
        ...state,
        signingIn: true,
        error: null
      }

    case 'SIGN_IN_SUCCESS':
      return {
        ...state,
        signingIn: false,
        credentials: action.credentials
      }

    case 'SIGN_IN_ERROR':
      return {
        ...state,
        signingIn: false,
        error: action.error
      }

    case 'SIGN_OUT':
      return {
        ...state,
        credentials: false
      }
  }

  return state
}
