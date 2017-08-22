export default value => document => {
  document.title = 'About'
  document.body.innerHTML = `
    <h1>About</h1>
    <p>${value.about || ''}</p>
    <p><a href="/">Back to index</a></p>
  `
}
