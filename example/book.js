const escape = require('lodash/escape')

export default book => document => {
  document.title = book.title
  document.body.innerHTML = `
    <h1>${book.title || ''}</h1>
    <p>${book.synopsis || ''}</p>
    <p><a href="/">Back to index</a></p>
    ${book.cover ? `<img src="${book.cover.variations[0].url}" />` : ''}
    <pre>${escape(JSON.stringify(book, null, 2))}</pre>
  `
}
