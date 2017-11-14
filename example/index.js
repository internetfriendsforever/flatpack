import flatpack from '../lib/flatpack'
import map from 'lodash/map'
import frontpage from './frontpage'
import about from './about'
import book from './book'

flatpack({
  path: 'edit',

  aws: {
    s3Region: 'eu-west-1',
    s3Bucket: 'books.iff.ninja',
    cloudfrontDistributionId: 'E2R23UKINJCRNI',
    cognitoUserPoolId: 'eu-west-1_wsv33WPaO',
    cognitoUserPoolClientId: '5d3m81tnmv5ffokol7v9rel08o',
    cognitoIdentityPoolId: 'eu-west-1:f6e15082-cd98-4f7f-a71c-559e92e99f88'
  },

  fields: ({ text, list, image, group, select, slider }) => ({
    name: text(),
    mode: select({
      label: 'Mode',
      options: {
        normal: 'Normal',
        night: 'Night'
      }
    }),
    about: group({
      label: 'About'
    }, {
      body: text(),
      contributors: list({
        label: 'Contributors',
        itemLabel: item => item.name
      }, {
        name: text(),
        image: image()
      })
    }),
    books: list({
      label: 'Books',
      itemLabel: item => item.title
    }, {
      title: text(),
      slug: text(),
      rating: slider({
        max: 10
      }),
      cover: image({
        interval: 500,
        thumbnailSize: 20
      }),
      synopsis: text({
        label: 'Synopsis',
        rich: true
      }),
      reviews: list({
        label: 'Reviews',
        itemLabel: item => item.title || 'New review'
      }, {
        title: text()
      })
    })
  }),

  manifest: Object.assign({
    value: {
      name: 'IFF Books',
      mode: 'night',
      about: {
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam tristique consequat fringilla. Ut nisl erat, volutpat ac lorem et, consectetur iaculis lacus'
      },
      books: [{
        title: 'Book of Love',
        slug: 'the-book-of-love',
        synopsis: '<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit. Aliquam tristique consequat fringilla. Ut nisl erat, volutpat ac lorem et, consectetur iaculis lacus</p>'
      }, {
        title: 'Book of Death',
        slug: 'the-book-of-death',
        synopsis: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam tristique consequat fringilla. Ut nisl erat, volutpat ac lorem et, consectetur iaculis lacus</p>'
      }]
    }
  }, window.manifest),

  routes: value => [
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
