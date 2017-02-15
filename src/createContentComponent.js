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

    componentDidMount () {
      this.mounted = true
      this.updateComponent()
    }

    componentWillUnmount () {
      this.mounted = false
    }

    componentWillReceiveProps () {
      this.updateComponent()
    }

    isEditing () {
      return this.context.flatpack.store.getState().editor.editing
    }

    updateComponent () {
      if (this.isEditing() && getEdit) {
        getEdit(Component => {
          this.setComponent(Component)
        })
      } else {
        this.setComponent(View)
      }
    }

    setComponent (Component) {
      if (this.mounted) {
        this.setState({ Component })
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
