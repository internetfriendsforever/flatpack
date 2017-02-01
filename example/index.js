import React from 'react'
import Frontpage from './Frontpage'
import Books from './Books'
import Book from './Book'

export default {
  // template: (html, content) => ``,
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

// window.addEventListener('load', () => {
//   ReactDOM.render(<Frontpage />, document.getElementById('root'))
// })

// export default {
//   '/': <Frontpage />,
//   '/collections/:collection.id/books/:books.id': (collectionId, bookId) => (
//     <Collection id={collectionId}>
//       <Book id={bookId} />
//     </Collection>
//   ),
//   '/books': <Books />,
//   '/books/:books.id/': id => <Book id={id} />
// }

// export default {
//   '/': <Frontpage />,
//   '/books': <Books />,
//   '/books/:books.id': id => <Book id={id} />,
//   '/libraries/:libraries.id/books/:books.id/': (libraryId, bookId) => (
//     <Library id={libraryId}>
//       <Book id={bookId} />
//     </Library>
//   )
// }
//
// export default {
//   '/': <Frontpage />,
//   '/books': <Books />,
//   '/books/:id': id => <Book />
// }

// <List path='books'>
//   {id => (
//     <Link href={`/books/${id}`}>
//       <Text path={`book/${id}/title`} placeholder='Book title' />
//     </Link>
//   )}
// </List>

/*
  /books/123456789
  /books/876543221
  /books/457876545
*/
