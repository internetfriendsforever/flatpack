import React from 'react'
import Frontpage from './Frontpage'
import Books from './Books'
import Book from './Book'

export default {
  // template: (partial, content) => `<html>${partial}</html>`,
  // webpack: config => merge(config, {}),

  routes: content => [
    {
      path: '/',
      component: <Frontpage />
    },

    {
      path: '/books',
      component: <Books books={content.books} />
    },

    ...content.books.map(book => ({
      path: `/books/${book.id}`,
      component: <Book id={book.id} />
    }))
  ]
}

// also supports:
// export default <Frontpage />

// and:
// export default [{
//   path: '/',
//   component: <Frontpage />
// }, {
//   path: '/books',
//   component: <Books books={[]} />
// }]

// and:
// export default content => [
//   {
//     path: '/',
//     component: <Frontpage />
//   },
//
//   {
//     path: '/books',
//     component: <Books books={content.books} />
//   },
//
//   ...content.books.map(book => ({
//     path: `/books/${book.id}`,
//     component: <Book id={book.id} />
//   }))
// ]
