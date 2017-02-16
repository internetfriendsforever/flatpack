import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import { createStore, applyMiddleware } from 'redux'

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

  return store
}
