import flatpack from '../lib/flatpack'
import map from 'lodash/map'
import frontpage from './frontpage'
import about from './about'
import book from './book'

flatpack({
  path: '/edit',

  aws: {
    s3Region: 'eu-west-1',
    s3Bucket: 'books.iff.ninja',
    cloudfrontDistributionId: 'E2R23UKINJCRNI',
    cognitoUserPoolId: 'eu-west-1_wsv33WPaO',
    cognitoUserPoolClientId: '5d3m81tnmv5ffokol7v9rel08o',
    cognitoIdentityPoolId: 'eu-west-1:f6e15082-cd98-4f7f-a71c-559e92e99f88'
  },

  fields: ({ text, list, image, group }) => ({
    name: text(),
    about: group({
      label: 'About'
    }, {
      body: text(),
      contributors: list({
        label: 'Contributors'
      }, {
        name: text(),
        image: image()
      })
    }),
    books: list({
      label: 'Books'
    }, {
      title: text(),
      slug: text(),
      cover: image(),
      synopsis: text()
    })
  }),

  defaultValue: {
    name: 'IFF Books',
    about: {
      body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam tristique consequat fringilla. Ut nisl erat, volutpat ac lorem et, consectetur iaculis lacus'
    },
    books: [{
      title: 'Book of Love',
      slug: 'the-book-of-love',
      synopsis: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam tristique consequat fringilla. Ut nisl erat, volutpat ac lorem et, consectetur iaculis lacus'
    }, {
      title: 'Book of Death',
      slug: 'the-book-of-death',
      synopsis: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam tristique consequat fringilla. Ut nisl erat, volutpat ac lorem et, consectetur iaculis lacus'
    }]
  },

  router: value => [
    {
      path: '/',
      render: frontpage(value)
    },

    {
      path: '/about',
      render: about(value)
    },

    ...map(value.books, item => {
      return {
        path: `/book/${item.slug}`,
        render: book(item)
      }
    })
  ]
})
