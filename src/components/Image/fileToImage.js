export default function fileToImage (file, callback) {
  const image = new window.Image()
  const reader = new window.FileReader()

  reader.addEventListener('load', e => {
    image.src = e.target.result
    callback(image)
  })

  reader.readAsDataURL(file)
}
