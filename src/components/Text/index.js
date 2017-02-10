import View from './View'
import createContentComponent from '../../createContentComponent'

const getEditComponent = callback => (
  require.ensure('./Edit', () => {
    callback(require('./Edit').default)
  }, 'editor')
)

export default createContentComponent(View, getEditComponent)
