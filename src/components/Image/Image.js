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
    const { width, height, thumbnail } = this.props.value
    const src = this.getSrc()

    const style = {
      width,
      height,
      backgroundImage: `url(${thumbnail})`,
      backgroundSize: 'cover'
    }

    if (thumbnail) {
      return (
        <div style={style}>
          {src && (
            <img src={src} />
          )}
        </div>
      )
    }

    return null
  }
}

export default ContentContainer(Image)
