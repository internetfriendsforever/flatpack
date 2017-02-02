const React = require('react')
const isValidElement = require('react').isValidElement
const NotFound = require('../components/NotFound').default

// Valid configs:
// 1. Valid React element
// <Component />

// 2. Array of routes
// [{ path: '', component: '' }]

// 3. Function
// content => [{ path: '', component: '' }]

// 4. Object
// { routes: content => [{ path: '', component: '' }] }

const defaultConfig = {
  aws: {},
  webpack: () => {},
  routes: () => [],
  notFoundRoute: <NotFound />,
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

module.exports = function defaults (entry) {
  if (entry.default) {
    return defaults(entry.default)
  }

  // Valid React element
  if (isValidElement(entry)) {
    return Object.assign({}, defaultConfig, {
      routes: () => [{ path: '/', component: entry }]
    })
  }

  // Array
  if (entry.constructor === Array) {
    return Object.assign({}, defaultConfig, {
      routes: () => entry
    })
  }

  // Object
  if (typeof entry === 'object' && entry.constructor === Object) {
    return Object.assign({}, defaultConfig, entry)
  }

  // Function
  if (typeof entry === 'function') {
    return Object.assign({}, defaultConfig, {
      routes: entry
    })
  }
}
