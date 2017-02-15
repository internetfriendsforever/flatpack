import React from 'react'

import { set } from '../actions/content'

export default Component => (
  class ContentComponent extends React.Component {
    static propTypes = {
      path: React.PropTypes.string.isRequired
    }

    static contextTypes = {
      flatpack: React.PropTypes.object
    }

    isEditing () {
      return this.context.flatpack.store.getState().editor.editing
    }

    setValue (value) {
      this.context.flatpack.store.dispatch(set(this.props.path, value))
    }

    render () {
      const store = this.context.flatpack.store
      const value = store.getContent(this.props.path)

      const props = { value }

      if (this.isEditing) {
        props.setValue = ::this.setValue
      }

      return (
        <Component {...this.props} {...props} />
      )
    }
  }
)
