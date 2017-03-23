import React from 'react'
import { toggleEditor } from '../actions/app'

const styles = {
  button: {
    position: 'fixed',
    bottom: 10,
    right: 10
  }
}

export default class EditButton extends React.Component {
  static contextTypes = {
    flatpack: React.PropTypes.object
  }

  onClick (e) {
    e.preventDefault()
    this.context.flatpack.store.dispatch(toggleEditor(true))
  }

  render () {
    if (this.context.flatpack.store.getState().app.editor) {
      return null
    }

    return (
      <button style={styles.button} onClick={::this.onClick}>
        Edit
      </button>
    )
  }
}
