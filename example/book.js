export default book => document => {
  document.title = book.title
  document.body.innerHTML = `
    <h1>${book.title || ''}</h1>
    <p>${book.synopsis || ''}</p>
    <p><a href="/">Back to index</a></p>
  `
}
