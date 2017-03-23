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

function sanitizeJSON (string) {
  return string
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
    .replace(/'/g, '\\u0027')
}

const defaultConfig = {
  routes: () => [],
  notFoundRoute: {
    title: '404 not found',
    component: <NotFound />
  },
  template: (html, title, content = {}, scripts = []) => {
    return `
      <!doctype html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>${title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <div id="root">
          ${html}
        </div>
        <script>
          window.content = '${sanitizeJSON(JSON.stringify(content))}';
          window.scripts = '${JSON.stringify(scripts)}';
        </script>
        ${scripts.map(script => `
          <script src="${script}"></script>
        `)}
      </body>
      </html>
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
