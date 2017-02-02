import { combineReducers } from 'redux'

import editor from './editor'
import content from './content'
import authentication from './authentication'

export default combineReducers({
  editor,
  content,
  authentication
})
