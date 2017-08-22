import map from 'lodash/map'

export default value => document => {
  const title = value.name || 'Book store'

  document.title = title
  document.body.innerHTML = `
    <h1>${title}</h1>

    <ul>
      ${map(value.books, book => (
        `<li>
          <a href="/book/${book.slug}">
            ${book.title}
          </a>
        </li>`
      )).join('')}
    </ul>

    <p><a href="/about">About</a></p>
  `
}
