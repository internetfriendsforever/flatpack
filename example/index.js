import React from 'react'
import { Text, List, Link, EditButton } from '../dist'

const styles = {
}

export default [{
  path: '/',
  component: (
    <div>
      <h1>Flatpack sample page</h1>
      <Text path='home/introduction' placeholder='This text is editable' />
      <Link href='/page2/'>Link to page 2</Link>
      <EditButton />
    </div>
  )
}, {
  path: '/page2/',
  component: (
    <div>
      <h1>Page 2</h1>

      <Text path='page2' placeholder='Text on page 2 is also editable' />

      <h2>Books:</h2>
      <List path='books'>
        {key => (
          <div style={styles.item} key={key}>
            {key}
            <Text path={`books/${key}/title`} placeholder='Book title…' />
          </div>
        )}
      </List>

      <Link href='/'>Back to frontpage</Link>

      <EditButton />
    </div>
  )
}]
