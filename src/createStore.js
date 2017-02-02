import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import { createStore, applyMiddleware } from 'redux'
import { Map } from 'immutable'

import reducers from './reducers'

const logger = createLogger({
  collapsed: true
})

export default initialState => {
  const store = createStore(
    reducers,
    initialState,
    applyMiddleware(
      thunk,
      logger
    )
  )

  store.getContent = path => {
    const state = store.getState().content.session
    const value = state.getIn(path.split('/'))
    return value instanceof Map ? value.toJS() : value
  }

  return store
}
