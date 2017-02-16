import React from 'react'
import { Iterable } from 'immutable'

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

    getValue () {
      const store = this.context.flatpack.store
      const state = store.getState().content.session
      const value = state.getIn(this.props.path.split('/'))
      return Iterable.isIterable(value) ? value.toJS() : value
    }

    render () {
      const props = {
        value: this.getValue()
      }

      if (this.isEditing) {
        props.setValue = ::this.setValue
      }

      return (
        <Component {...this.props} {...props} />
      )
    }
  }
)
