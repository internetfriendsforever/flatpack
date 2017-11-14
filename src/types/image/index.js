import React, { Component } from 'react'
import InputFile from '../../ui/InputFile'
import createType from '../createType'
import createThumbnail from './createThumbnail'
import fileToImage from './fileToImage'
import createImageVariations from './createImageVariations'

const supportedMimes = [
  'image/jpeg',
  'image/png',
  'image/gif'
]

function isFileSupported (file) {
  return supportedMimes.indexOf(file.type) > -1
}

function getObjectUrl (file) {
  return window.URL.createObjectURL(file)
}

const Edit = class extends Component {
  createOriginalUpload = file => {
    const { thumbnailSize } = this.props

    fileToImage(file, image => {
      this.props.onChange({
        url: getObjectUrl(file),
        thumbnail: createThumbnail(image, thumbnailSize).src
      })
    })
  }

  createResizedUpload = file => {
    const { interval, thumbnailSize } = this.props

    fileToImage(file, image => {
      createImageVariations({
        file,
        interval
      }, variations => {
        this.props.onChange({
          url: getObjectUrl(file),
          thumbnail: createThumbnail(image, thumbnailSize).src,
          variations: variations.map(variation => ({
            width: variation.width,
            height: variation.height,
            url: getObjectUrl(variation.blob)
          }))
        })
      })
    })
  }

  onChange = e => {
    const file = e.currentTarget.files[0]

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

    // Traverse for blobs when uploading, and get blob back by using fetch
    // window.fetch(url)
    //   .then(res => res.blob())
    //   .then(blob => {
    //     console.log(blob)
    //   })
    // }
  }

  render () {
    const { label } = this.props

    return (
      <InputFile
        label={label || 'Image'}
        onChange={this.onChange}
      />
    )
  }
}

export default createType({ Edit })
