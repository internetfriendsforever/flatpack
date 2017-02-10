import React from 'react'

import { set } from './actions/content'

export default (View, getEdit) => (
  class ContentComponent extends React.Component {
    static propTypes = {
      path: React.PropTypes.string.isRequired
    }

    static contextTypes = {
      flatpack: React.PropTypes.object
    }

    state = {
      Component: View
    }

    componentWillMount () {
      this.updateComponent()
    }

    componentWillReceiveProps () {
      this.updateComponent()
    }

    isEditing () {
      return this.context.flatpack.store.getState().editor.editing
    }

    updateComponent () {
      if (this.isEditing() && getEdit) {
        getEdit(Component => this.setState({ Component }))
      } else {
        this.setState({ Component: View })
      }
    }

    setValue (value) {
      this.context.flatpack.store.dispatch(set(this.props.path, value))
    }

    render () {
      const { Component } = this.state
      const store = this.context.flatpack.store
      const value = store.getContent(this.props.path)

      const props = { value }

      if (this.isEditing) {
        props.setValue = ::this.setValue
      }

      if (!Component) {
        return null
      }

      return (
        <Component {...this.props} {...props} />
      )
    }
  }
)
