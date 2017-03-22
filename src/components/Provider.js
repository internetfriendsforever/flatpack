import React from 'react'
import { fromJS } from 'immutable'

import createStore from '../createStore'

export default class Provider extends React.Component {
  static propTypes = {
    config: React.PropTypes.object.isRequired,
    content: React.PropTypes.object.isRequired,
    scripts: React.PropTypes.array.isRequired,
    children: React.PropTypes.element.isRequired,
    history: React.PropTypes.object
  }

  static childContextTypes = {
    flatpack: React.PropTypes.object
  }

  getChildContext () {
    return {
      flatpack: {
        config: this.props.config,
        content: this.props.content,
        scripts: this.props.scripts,
        history: this.props.history,
        store: this.store
      }
    }
  }

  state = {
    Editor: null
  }

  constructor (props) {
    super(props)

    this.store = createStore({
      content: {
        session: fromJS(props.content),
        published: fromJS(props.content),
        uploads: {}
      }
    })

    this.store.subscribe(::this.forceUpdate)
  }

  componentWillMount () {
    this.checkForEditor()
  }

  componentDidUpdate () {
    this.checkForEditor()
  }

  componentWillReceiveProps (nextProps) {
    document.title = nextProps.title
  }

  checkForEditor () {
    if (!this.state.Editor && this.store.getState().app.editor) {
      require.ensure('./Editor', require => {
        this.setState({
          Editor: require('./Editor').default
        })
      }, 'editor')
    }
  }

  renderChild () {
    return React.Children.only(this.props.children)
  }

  render () {
    const { Editor } = this.state
    const { editor } = this.store.getState().app

    if (editor && Editor) {
      return (
        <Editor>
          {this.renderChild()}
        </Editor>
      )
    } else {
      return this.renderChild()
    }
  }
}
