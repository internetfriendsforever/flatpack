import React, { Component } from 'react'
import isUrlExternal from '../utils/isUrlExternal'

const styles = {
  iframe: {
    flex: 'auto',
    background: 'white'
  }
}

export default class Preview extends Component {
  componentDidUpdate () {
    this.update()
  }

  shouldComponentUpdate (nextProps) {
    if (nextProps.route !== this.props.route) {
      this.update(nextProps.route)
    }
    return false
  }

  onRef = node => {
    if (node) {
      this.iframe = node
      this.update()
      this.iframe.contentDocument.addEventListener('click', this.onClick)
    }
  }

  update (route = this.props.route) {
    route.render(this.iframe.contentDocument)
  }

  onClick = (e) => {
    const link = e.target.closest('a')

    if (link) {
      e.preventDefault()

      if (!isUrlExternal(link.href)) {
        const { pathname, search = '', hash = '' } = link
        this.props.onNavigate(`${pathname}${search}${hash}`)
      } else {
        window.open(link.href)
      }
    }
  }

  render () {
    return (
      <iframe
        style={styles.iframe}
        ref={this.onRef}
      />
    )
  }
}
