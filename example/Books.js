import React from 'react'
import Layout from './Layout'

export default class Books extends React.Component {
  componentDidMount () {
    console.log('Books mounted')
  }

  render () {
    return (
      <Layout>
        Books
      </Layout>
    )
  }
}

Books.propTypes = {
  books: React.PropTypes.array
}
