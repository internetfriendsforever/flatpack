export default function isUrlExternal (url) {
  const domain = url => url.replace('http://', '').replace('https://', '').split('/')[0]
  return domain(window.location.href) !== domain(url)
}
