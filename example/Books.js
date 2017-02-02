import React from 'react'
import Menu from './Menu'
import Link from '../dist/components/Link'

export default class Books extends React.Component {
  componentDidMount () {
    console.log('Books mounted')
  }

  render () {
    return (
      <div>
        <Menu />
        Books

        <ul>
          {this.props.books.map(book => (
            <li key={book.id}>
              <Link href={`books/${book.id}`}>
                {book.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

Books.propTypes = {
  books: React.PropTypes.array
}
