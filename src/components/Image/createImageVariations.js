import { times } from 'lodash'
import fileToImage from './fileToImage'

function getWidths (width, interval = 320) {
  const count = Math.max(1, Math.floor(width / interval))
  const sizes = times(count, i => (i + 1) * interval)

  sizes[sizes.length - 1] = width

  return sizes
}

function hasTransparancy (image) {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  canvas.width = image.width
  canvas.height = image.height

  context.drawImage(image, 0, 0, image.width, image.height)

  const data = context.getImageData(0, 0, context.canvas.width, context.canvas.height).data

  for (var i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 255) {
      return true
    }
  }

  return false
}

function createVariation (image, width, type = 'image/jpeg', quality = 0.8) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')

    canvas.width = width
    canvas.height = Math.round(width * (image.height / image.width))

    context.drawImage(image, 0, 0, canvas.width, canvas.height)

    return canvas.toBlob(blob => resolve({
      width: canvas.width,
      height: canvas.height,
      image: image,
      blob: blob
    }), type, quality)
  })
}

export default function getImageVariations (file, callback) {
  fileToImage(file, image => {
    const widths = getWidths(image.width)

    let type = file.type

    if (type === 'image/png' && !hasTransparancy(image)) {
      console.log('image/png image doesn’t have transparancy. Converting to image/jpeg')
      type = 'image/jpeg'
    }

    const variationPromises = widths.map(width => (
      createVariation(image, width, type)
    ))

    Promise.all(variationPromises).then(variations => callback(variations))
  })
}
