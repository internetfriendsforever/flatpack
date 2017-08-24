export default function loadScript (src, callback) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    document.body.appendChild(script)
    script.addEventListener('load', () => {
      resolve()
    })
  })
}
