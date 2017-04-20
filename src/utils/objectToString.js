module.exports = function objectToString (object) {
  return JSON.stringify(object, (key, value) => (
    typeof value === 'string' ? escape(value) : value
  ))
}
