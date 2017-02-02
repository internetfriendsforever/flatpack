import { Map, fromJS } from 'immutable'

const initialState = {
  published: Map({}),
  session: Map({})
}

export default function content (state = initialState, action) {
  switch (action.type) {
    case 'SET':
      const path = action.path.split('/')

      return {
        ...state,
        session: state.session.updateIn(path, () => (
          fromJS(action.value))
        )
      }

    case 'DISCARD':
      return {
        ...state,
        session: state.published
      }

    case 'RELEASE_SUCCESS':
      return {
        ...state,
        published: state.session
      }
  }

  return state
}
