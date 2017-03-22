import View from './View'
import EditorContainer from '../EditorContainer'

const getEditComponent = callback => (
  require.ensure('./Edit', () => {
    callback(require('./Edit').default)
  }, 'editor')
)

export default EditorContainer(View, getEditComponent)
