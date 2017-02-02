import React from 'react'
import Frontpage from './Frontpage'
import Books from './Books'
// import Book from './Book'

export default {
  aws: {
    s3Region: 'eu-central-1',
    s3Bucket: 'example-site.iff.ninja',
    cognitoUserPoolId: 'eu-west-1_F5cZoQJsU',
    cognitoUserPoolClientId: '4tmcrkbhkurm2nfv76m849j5l7',
    cognitoIdentityPoolId: 'eu-west-1:cb2bdcb0-ecdc-4e49-8816-ea1126eb9f1c'
  },

  routes: content => [{
    path: '/',
    component: <Frontpage />
  }, {
    path: '/books',
    component: <Books />
  }]
}

// export default {
//   // template: (partial, content) => `<html>${partial}</html>`,
//   // webpack: config => merge(config, {}),
//   // notFoundRoute: <NotFound />,
//
//   aws: {
//     s3Region: 'eu-central-1',
//     s3Bucket: 'example-site.iff.ninja',
//     cognitoUserPoolId: 'eu-west-1_F5cZoQJsU',
//     cognitoUserPoolClientId: '4tmcrkbhkurm2nfv76m849j5l7',
//     cognitoIdentityPoolId: 'eu-west-1:cb2bdcb0-ecdc-4e49-8816-ea1126eb9f1c'
//   },
//
//   routes: content => [
//     {
//       path: '/',
//       component: <Frontpage />
//     },
//
//     {
//       path: '/books',
//       component: <Books books={content.books} />
//     },
//
//     ...content.books.map(book => ({
//       path: `/books/${book.id}`,
//       component: <Book id={book.id} />
//     }))
//   ]
// }

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
