import React from 'react'
import { map } from 'lodash'

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
    this.context.flatpack.store.dispatch(fetchCredentials())
  }

  hasChanges () {
    const { session, published } = this.context.flatpack.store.getState().content
    return !session.equals(published)
  }

  publish () {
    const { store, config, scripts } = this.context.flatpack
    const { authentication, content } = store.getState()
    const { session } = content
    const { credentials } = authentication
    const uploads = map(content.uploads, upload => upload.payload)

    this.context.flatpack.store.dispatch(publish({
      content: session.toJS(),
      credentials,
      config,
      scripts,
      uploads
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
      </div>
    )
  }
}
