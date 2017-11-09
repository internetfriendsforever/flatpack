# Flatpack
A lightweight in-browser content editor that bundles with your static website.

Requires [Node.js](https://nodejs.org) and familiarity with
[yarn](https://yarnpkg.com)/[npm](https://www.npmjs.com/),
[JavaScript](https://developer.mozilla.org/bm/docs/Web/JavaScript), and [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML).

## Getting started

Navigate to your project folder in your favourite command-line tool and install dependency
```
yarn add flatpack
```

Add a start script to your `package.json`

```
"scripts": {
  "start": "flatpack start"
}
```

Create your app in `index.js`

```js
import flatpack from 'flatpack'

flatpack({
  fields: ({ text }) => ({
    title: text()
  }),

  routes: value => [{
    path: '/',
    render: document => {
      document.title = value.title
      document.body.innerHTML = `
        <h1>${value.title}</h1>
      `
    }
  }]
})
```

Start local server from command-line

```
yarn start
```

That’s it! Now you can view the app in your browser, and navigate to `/edit` to use the editor

## Usage

### Using React

Install dependencies
```
$ npm install flatpack react react-dom
```

`index.js`

```js
import flatpack from 'flatpack'
import React from 'react'
import { render } from 'react-dom'

flatpack({
  fields: ({ text }) => ({
    title: text()
  }),

  routes: () => [{
    path: '/',
    render: document => {
      const container = document.createElement('div')
      
      ReactDOM.render((
        <h1>{title}</h1>
      ), container)

      document.body.appendChild(container)
    }
  }]
})
```

### Custom babel config

Just create `.babelrc` with your own preferred config. Example:
```
{
  "presets": ["latest", "stage-0"]
}
```
Don’t forget to install your added presets or plugins `yarn add babel-preset-stage-0`

### Custom webpack setup using plugin

Install dependencies
```
yarn add flatpack webpack webpack-dev-server
```

Create a webpack config `webpack.config.js`
```js
const path = require('path')
const FlatpackWebpackPlugin = require('flatpack/webpack-plugin')

module.exports = {
  entry: path.resolve(__dirname, 'index.js'),

  output: {
    path: path.join(__dirname, 'build')
  },

  plugins: [
    new FlatpackWebpackPlugin()
  ]
}
```

Run server `./node_modules/.bin/webpack-dev-server`

Note: If you want to use ES6 with a custom webpack config, you need to set this up the usual way (with [babel](http://babeljs.io/)/[babel-loader](https://github.com/babel/babel-loader) or another transpiler)

### ES5 usage
```js
var flatpack = require('flatpack')

flatpack({
  fields: function (types) {
    return {
      title: types.text()
    }
  },

  routes: function (value) {
    return [{
      path: '/',
      render: function (document) {
        document.title = value.title
        document.body.innerHTML = `
          <h1>${value.title}</h1>
        `
      }
    }]
  }
})
```

### Custom editor field types

To be implemented…

### Using content for defining routes

You can use values from the editor to define your routes. This example leverages ES6 spread syntax to create a list of books that map to their respective urls

```js
import flatpack from 'flatpack'

flatpack({
  fields: ({ list, text }) => ({
    books: list({ label: 'Books' }, {
      title: text(),
      slug: text()
    })
  }),

  routes: value => [
    ...value.books.map(book => ({
      path: `/book/${item.slug}`,
      render: document => {
        document.title = book.title
        document.innerHTML = `<h1>${book.title}</h1>`
      }
    }))
  ]
})
```
