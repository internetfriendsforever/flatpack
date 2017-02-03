import React from 'react'
import { fromJS } from 'immutable'

import createStore from '../createStore'

export default class Provider extends React.Component {
  static propTypes = {
    config: React.PropTypes.object.isRequired,
    content: React.PropTypes.object.isRequired,
    assets: React.PropTypes.object.isRequired,
    children: React.PropTypes.element.isRequired,
    render: React.PropTypes.func
  }

  static childContextTypes = {
    flatpack: React.PropTypes.object
  }

  getChildContext () {
    return {
      flatpack: {
        store: this.store,
        config: this.props.config,
        content: this.props.content,
        assets: this.props.assets,
        render: this.props.render
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
        published: fromJS(props.content)
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

  checkForEditor () {
    if (!this.state.Editor && this.store.getState().app.editor) {
      require.ensure('./Editor', () => {
        this.setState({
          Editor: require('./Editor').default
        })
      })
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
