import React from 'react'

import ContentContainer from '../ContentContainer'

class Image extends React.Component {
  static propTypes = {
    path: React.PropTypes.string.isRequired,
    value: React.PropTypes.object
  }

  static defaultProps = {
    value: {}
  }

  static contextTypes = {
    flatpack: React.PropTypes.object
  }

  getSrc () {
    const { url } = this.props.value
    const { uploads } = this.context.flatpack.store.getState().content
    const upload = uploads[this.props.path]

    if (upload) {
      return upload.preview
    }

    return url
  }

  render () {
    const src = this.getSrc()

    if (src) {
      return (
        <img src={src} />
      )
    }

    return null
  }
}

export default ContentContainer(Image)
