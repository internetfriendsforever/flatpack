# **flatpack js** is a static website editor that runs in the browser.

## Prerequisites
Flatpack requires <a href="https://nodejs.org/">node.js</a> and some familiarity
with JavaScript&nbsp;(<a href="https://www.ecma-international.org/ecma-262/6.0/">ES6</a>),
<a href="https://yarnpkg.com/">yarn</a>/npm,
<a href="https://facebook.github.io/react/">React</a> and HTML.

Flatpack should be installed globally, so you can use it from any project: `yarn global add flatpack-js`

## Getting started

1. `cd /project-folder`
2. `yarn add react`
3. `touch index.js`

Open `index.js` in your favourite text editor

```
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
