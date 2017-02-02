import React from 'react'
import { fromJS } from 'immutable'

import createStore from '../createStore'

export default class Provider extends React.Component {
  static propTypes = {
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
        content: this.props.content,
        assets: this.props.assets,
        render: this.props.render
      }
    }
  }

  constructor (props) {
    super(props)

    this.store = createStore({
      app: {
        assets: this.props.assets
      },

      content: {
        session: fromJS(props.content),
        published: fromJS(props.content)
      }
    })

    this.store.subscribe(::this.forceUpdate)
  }

  render () {
    return React.Children.only(this.props.children)
  }
}
