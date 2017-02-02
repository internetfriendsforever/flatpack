import React from 'react'
import Menu from './Menu'

export default class Books extends React.Component {
  componentDidMount () {
    console.log('Books mounted')
  }

  render () {
    return (
      <div>
        <h1>Book store</h1>
        <Menu />
      </div>
    )
  }
}

Books.propTypes = {
  books: React.PropTypes.array
}
