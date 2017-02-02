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

  render () {
    return React.Children.only(this.props.children)
  }
}
