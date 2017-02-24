import React from 'react'
import { first } from 'lodash'

import Image from './Image'
import ContentContainer from '../ContentContainer'
import DOMComponent from '../DOMComponent'
import createThumbnail from './createThumbnail'
import fileToImage from './fileToImage'
import { set, setImageUpload } from '../../actions/content'

function isImage (file) {
  return /^image\//.test(file.type)
}

const styles = {
  container: {
    border: '1px blue solid',
    minHeight: 50,
    minWidth: 50
  },

  dragOver: {
    background: 'yellow'
  }
}

class EditImage extends React.Component {
  static propTypes = {
    path: React.PropTypes.string.isRequired,
    value: React.PropTypes.object,
    setValue: React.PropTypes.func.isRequired,
    attrs: React.PropTypes.object
  }

  static defaultProps = {
    value: {},
    attrs: {}
  }

  static contextTypes = {
    flatpack: React.PropTypes.object
  }

  state = {
    dragOver: false
  }

  componentWillReceiveProps (nextProps) {
  }

  onDragOver = e => {
    e.stopPropagation()
    e.preventDefault()

    this.setState({
      dragOver: true
    })
  }

  onDragLeave = e => {
    this.setState({
      dragOver: false
    })
  }

  onDrop = e => {
    e.preventDefault()

    this.setState({
      dragOver: false
    })

    const file = first(e.dataTransfer.files)

    if (file && isImage(file)) {
      const uploadAction = setImageUpload(this.props.path, file)

      this.context.flatpack.store.dispatch(uploadAction)

      fileToImage(file, image => {
        const metaUpdateAction = set(this.props.path, {
          ...this.props.value,
          width: image.width,
          height: image.height,
          thumbnail: createThumbnail(image, 10).src
        })

        this.context.flatpack.store.dispatch(metaUpdateAction)
      })
    } else {
      // TODO: Notify user of wrong filetype
      console.log('Not an image')
    }
  }

  render () {
    const { dragOver } = this.state

    const style = {
      ...this.props.attrs.style,
      ...styles.container,
      ...(dragOver && styles.dragOver)
    }

    const attrs = {
      ...this.props.attrs,
      style,
      onDrop: this.onDrop,
      onDragOver: this.onDragOver,
      onDragLeave: this.onDragLeave
    }

    return (
      <DOMComponent {...this.props} attrs={attrs}>
        <Image path={this.props.path} />
      </DOMComponent>
    )
  }
}

export default ContentContainer(EditImage)
