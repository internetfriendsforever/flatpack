const history = require('history')

if (typeof document === 'undefined') {
  module.exports = history.createMemoryHistory()
} else {
  module.exports = history.createBrowserHistory()
}
