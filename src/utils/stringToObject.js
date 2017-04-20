module.exports = function stringToObject (string) {
  return JSON.parse(string, (key, value) => (
    typeof value === 'string' ? unescape(value) : value
  ))
}
