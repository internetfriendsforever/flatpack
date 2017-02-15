import React from 'react'

export default (View, getEdit) => (
  class EditorComponent extends React.Component {
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

    render () {
      const { Component } = this.state

      if (!Component) {
        return null
      }

      return (
        <Component {...this.props} />
      )
    }
  }
)
