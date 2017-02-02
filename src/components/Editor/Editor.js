import React from 'react'

import Message from './Message'
import Window from './Window'
import WindowHeader from './WindowHeader'
import SignIn from './SignIn'
import Toolbar from './Toolbar'
import { fetchCredentials } from '../../actions/authentication'
import { discard } from '../../actions/content'
import { publish } from '../../actions/editor'

const styles = {
  editor: {
    color: 'white',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif'
  },

  editOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
    pointerEvents: 'none'
  },

  contentPushedDown: {
    position: 'relative',
    paddingTop: 50
  }
}

export default class Editor extends React.Component {
  static propTypes = {
    children: React.PropTypes.node
  }

  static defaultProps = {
    editing: false
  }

  static contextTypes = {
    flatpack: React.PropTypes.object.isRequired
  }

  componentDidMount () {
    const action = fetchCredentials(this.context.flatpack.config.aws)
    this.context.flatpack.store.dispatch(action)
  }

  hasChanges () {
    const { session, published } = this.context.flatpack.store.getState().content
    return !session.equals(published)
  }

  publish () {
    const { store, data, render } = this.context.flatpack
    const { authentication, content } = store.getState()
    const { session } = content
    const { credentials } = authentication

    this.context.flatpack.store.dispatch(publish({
      aws: this.context.flatpack.config.aws,
      credentials: credentials,
      renderer: render,
      data: {
        content: session.toJS(),
        assets: data.assets
      }
    }))
  }

  discard () {
    if (window.confirm('Are you sure you want to discard all changes?')) {
      this.context.flatpack.store.dispatch(discard())
    }
  }

  renderEditor () {
    const state = this.context.flatpack.store.getState()
    const { credentials } = state.authentication
    const { publishing, building, uploading, releasing } = state.editor

    if (credentials === null) {
      return (
        <Message>
          Getting authentication…
        </Message>
      )
    }

    if (credentials === false) {
      return (
        <Window>
          <WindowHeader>
            Login
          </WindowHeader>

          <SignIn />
        </Window>
      )
    }

    return (
      <div>
        <Toolbar
          changes={this.hasChanges()}
          discard={::this.discard}
          publish={::this.publish}
        />

        {publishing && (<Message>Publishing…</Message>)}
        {building && (<Message>Building…</Message>)}
        {uploading && (<Message>Uploading…</Message>)}
        {releasing && (<Message>Releasing…</Message>)}
      </div>
    )
  }

  render () {
    const state = this.context.flatpack.store.getState()
    const { credentials } = state.authentication
    const contentStyles = credentials && styles.contentPushedDown || {}

    return (
      <div>
        <div style={styles.editor}>
          {this.renderEditor()}
        </div>

        <div style={contentStyles}>
          {this.props.children}
        </div>

        {state.editor.editing && (
          <div style={styles.editOverlay} />
        )}
      </div>
    )
  }
}
