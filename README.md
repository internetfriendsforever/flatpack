# flatpack

a static website editor that runs in the browser
Note: Flatpack is still under development, and might not work as the following suggests

## Prerequisites
Flatpack requires <a href="https://nodejs.org/">node.js</a> and some familiarity
with JavaScript&nbsp;(<a href="https://www.ecma-international.org/ecma-262/6.0/">ES6</a>),
<a href="https://yarnpkg.com/">yarn</a>/npm,
<a href="https://facebook.github.io/react/">React</a> and HTML.

## Getting started

Flatpack should be installed globally, so you can use it from any project: `yarn global add flatpack-js`

1. `cd /project-folder`
2. `yarn add react`
3. `touch index.js`

Open `index.js` in your favourite text editor

```javascript
import React from 'react'
import { Text } from 'flatpack-js'

export default (
  <div>
    <h1>Hello flatpack!</h1>
    <Text path='introduction' placeholder='Introduction goes here…' />
  </div>
)
```

For a simple one-page website, you will need to define a component
for your content to live in.
This can be done in a separate file and imported, but for brevity,
lets define it in `index.js`.

Now you should be able to run <code>flatpack dev</code> from
the command line and see your example running at `http://localhost:3000/`

## Components
All built-in components have a `path` prop. This is where flatpack finds and stores data.

### The `<Text />` component
The text component uses [slate](https://github.com/ianstormtaylor/slate/) to serialise data.

#### Props
- `path` **string**, see [path](#path)
- `placeholder` **string** text to show in the editor when `path` does not have data, for example when a new element is created.
- `inline` (**array** of inline elements supported, ie. `['i', 'b', 'a', 'strike']`). Default is `[]`
- `block` (**array** of block-level elements like `['h2', 'h3', 'h4', 'p', 'ul', 'ol']` if `block` is **not** defined, no text will be wrapped in a block-level element. Perfect for text inside an existing `<h1>` or `<p>` tag. Default is `[]`

## Routing
Routes need to be defined with a trailing slash for compatibility with S3 and CloudFront, see external article re. ‘[advices for best performance](http://www.michaelgallego.fr/blog/2013/08/27/static-website-on-s3-cloudfront-and-route-53-the-right-way/#advices-for-best-performance)’
