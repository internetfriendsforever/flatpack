import React from 'react'
import { first, pick } from 'lodash'

import View from './View'
import ContentContainer from '../ContentContainer'
import EditIndicator from '../EditIndicator'
import createThumbnail from './createThumbnail'
import fileToImage from './fileToImage'
import createImageVariations from './createImageVariations'
import { set, setUpload } from '../../actions/content'

const supportedMimes = [
  'image/jpeg',
  'image/png',
  'image/gif'
]

function isFileSupported (file) {
  return supportedMimes.indexOf(file.type) > -1
}

const styles = {
  container: {
    position: 'relative',
    minHeight: 50,
    minWidth: 50
  },

  dragOver: {
    background: 'yellow'
  },

  removeButton: {
    position: 'absolute',
    top: 0,
    right: 0
  },

  instructions: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  }
}

class EditImage extends React.Component {
  static propTypes = {
    path: React.PropTypes.string.isRequired,
    value: React.PropTypes.object,
    setValue: React.PropTypes.func.isRequired,
    style: React.PropTypes.object
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

  createOriginalUpload (file) {
    fileToImage(file, image => {
      const uploadPath = `uploads/${Date.now()}`

      const uploadAction = setUpload(this.props.path, {
        preview: image.src,
        files: {
          path: `${uploadPath}`,
          data: file
        }
      })

      const valueAction = set(this.props.path, {
        path: `/${uploadPath}`,
        type: file.type,
        width: image.width,
        height: image.height,
        thumbnail: createThumbnail(image, 10).src
      })

      this.context.flatpack.store.dispatch(uploadAction)
      this.context.flatpack.store.dispatch(valueAction)
    })
  }

  createResizedUpload (file) {
    fileToImage(file, image => {
      createImageVariations(file, variations => {
        const uploadPath = `uploads/${Date.now()}`

        const uploadAction = setUpload(this.props.path, {
          preview: image.src,
          files: variations.map(({ width, blob }) => ({
            path: `${uploadPath}/${width}`,
            data: blob
          }))
        })

        const valueAction = set(this.props.path, {
          path: `/${uploadPath}`,
          type: file.type,
          width: image.width,
          height: image.height,
          variations: variations.map(variation => pick(variation, ['width', 'height'])),
          thumbnail: createThumbnail(image, 10).src
        })

        this.context.flatpack.store.dispatch(uploadAction)
        this.context.flatpack.store.dispatch(valueAction)
      })
    })
  }

  onDrop = e => {
    e.preventDefault()

    this.setState({
      dragOver: false
    })

    const file = first(e.dataTransfer.files)

    if (file && isFileSupported(file)) {
      if (file.type === 'image/gif') {
        this.createOriginalUpload(file)
      } else {
        this.createResizedUpload(file)
      }
    } else {
      const supportedFormatsFriendly = supportedMimes.map(mime => mime.split('/')[1]).join(', ')
      window.alert(`Only images of types ${supportedFormatsFriendly} are supported`)
    }
  }

  onRemoveImageClick = () => {
    this.props.setValue({})
  }

  render () {
    const { value } = this.props
    const { dragOver } = this.state

    const containerStyle = {
      ...styles.container,
      ...(dragOver && styles.dragOver)
    }

    return (
      <EditIndicator>
        <div style={containerStyle} onDrop={this.onDrop} onDragOver={this.onDragOver} onDragLeave={this.onDragLeave}>
          <View path={this.props.path} style={this.props.style} />

          {value.path && (
            <button style={styles.removeButton} onClick={this.onRemoveImageClick}>Remove image</button>
          )}

          {!value.path && (
            <div style={styles.instructions}>
              Drop image file here…
            </div>
          )}
        </div>
      </EditIndicator>
    )
  }
}

export default ContentContainer(EditImage)
