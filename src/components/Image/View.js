import React from 'react'
import { first, map } from 'lodash'

import ContentContainer from '../ContentContainer'

const styles = {
  image: {
    display: 'block',
    maxWidth: '100%'
  }
}

class View extends React.Component {
  static propTypes = {
    path: React.PropTypes.string.isRequired,
    value: React.PropTypes.object,
    style: React.PropTypes.object
  }

  static defaultProps = {
    value: {}
  }

  static contextTypes = {
    flatpack: React.PropTypes.object
  }

  getUploadPreview () {
    const { uploads } = this.context.flatpack.store.getState().content
    const upload = uploads[this.props.path]

    if (upload) {
      console.log('Getting upload preview', upload.preview.length)
      return upload.preview
    }
  }

  getImageProps () {
    const { path, variations } = this.props.value
    const preview = this.getUploadPreview()

    if (preview) {
      return { src: preview }
    }

    if (variations) {
      return {
        src: `${path}/${first(variations).width}`,
        srcSet: map(variations, variation => (
          `${path}/${variation.width} ${variation.width}w`)
        ).join(', ')
      }
    }

    if (path) {
      return {
        src: path
      }
    }
  }

  hasImage () {
    return this.props.value || this.getUploadPreview()
  }

  render () {
    if (!this.hasImage()) {
      return null
    }

    const style = {
      ...styles.image,
      ...this.props.style
    }

    return <img style={style} {...this.getImageProps()} />
  }
}

export default ContentContainer(View)
