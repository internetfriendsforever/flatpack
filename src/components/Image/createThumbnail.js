const canvas = document.createElement('canvas')
const context = canvas.getContext('2d')

export default function createThumbnail (image, size = 72) {
  const thumbnail = new window.Image()
  const vertical = image.width < image.height
  const ratio = image.width / image.height

  canvas.width = vertical ? size * ratio : size
  canvas.height = vertical ? size : size / ratio

  context.drawImage(image, 0, 0, canvas.width, canvas.height)

  thumbnail.src = canvas.toDataURL()

  return thumbnail
}
