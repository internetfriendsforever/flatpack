import { combineReducers } from 'redux'

import app from './app'
import editor from './editor'
import content from './content'
import authentication from './authentication'

export default combineReducers({
  app,
  editor,
  content,
  authentication
})
