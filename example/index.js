import React from 'react'
import { Text, List, ListItem, Image, Link, EditButton } from '../dist'
import Home from './Home'

const styles = {
  books: {
    display: 'flex',
    flexWrap: 'wrap'
  },

  book: {
    flex: '0 0 200px',
    margin: 10,
    padding: 10,
    background: '#ddd'
  }
}

export default [{
  path: '/',
  title: 'Home',
  component: (
    <Home />
  )
}, {
  path: '/page2/',
  title: 'Page 2',
  component: (
    <div>
      <h1>Page 2</h1>

      <Text path='page2' placeholder='Text on page 2 is also editable' />

      <h2>Books:</h2>
      <List path='books' axis='xy' reverse attrs={{ style: styles.books }}>
        {key => (
          <ListItem attrs={{ style: styles.book }} key={key}>
            <Image path={`books/${key}/cover`} />
            <Text path={`books/${key}/title`} placeholder='Book title…' />
          </ListItem>
        )}
      </List>

      <Link href='/page2/'>Page 2</Link>
      <Link href='/'>Back to frontpage</Link>

      <EditButton />
    </div>
  )
}]
