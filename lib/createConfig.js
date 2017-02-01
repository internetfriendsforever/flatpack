const isValidElement = require('react').isValidElement

const defaults = {
  webpack: () => {},
  template: (html, content) => {
    return `
      <div id="root">
        ${html}
      </div>
      <script>
        window.content = '${JSON.stringify(content)}';
      </script>
      <script src="/client.js"></script>
    `
  }
}

// Valid configs:
// 1. Valid React element
// <Component />

// 2. Array of routes
// [{ path: '', component: '' }]

// 3. Function
// content => [{ path: '', component: '' }]

// 4. Object
// { routes: content => [{ path: '', component: '' }] }

module.exports = function createConfig (entry) {
  if (entry.default) {
    return createConfig(entry.default)
  }

  // Valid React element
  if (isValidElement(entry)) {
    return Object.assign({}, defaults, {
      routes: () => [{ path: '/', component: entry }]
    })
  }

  // Array
  if (entry.constructor === Array) {
    return Object.assign({}, defaults, {
      routes: () => entry
    })
  }

  // Object
  if (typeof entry === 'object' && entry.constructor === Object) {
    return Object.assign({}, defaults, entry)
  }

  // Function
  if (typeof entry === 'function') {
    return Object.assign({}, defaults, {
      routes: entry
    })
  }
}
