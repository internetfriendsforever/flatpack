import React from 'react'
import { Text, List, Link, EditButton } from '../dist'

const styles = {
}

export default [{
  path: '/',
  component: (
    <div>
      <h1>Flatpack sample page</h1>
      <Text path='introduction' placeholder='This text is editable' />
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

      <h2>A list:</h2>
      <List path='list'>
        {key => (
          <div style={styles.item} key={key}>
            {key}
            <Text path={`list-${key}`} placeholder='Item text editable' />
          </div>
        )}
      </List>

      <Link href='/'>Back to frontpage</Link>

      <EditButton />
    </div>
  )
}]
