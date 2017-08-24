import map from 'lodash/map'

export default value => document => {
  document.title = 'About'
  document.body.innerHTML = `
    <h1>About</h1>
    <p>${value.about.body || ''}</p>
    <h2>Contributors</h2>
    <ul>
      ${map(value.about.contributors, contributor => (
        `<li>
          ${contributor.name}
        </li>`
      )).join('')}
    </ul>
    <p><a href="/">Back to index</a></p>
  `
}
