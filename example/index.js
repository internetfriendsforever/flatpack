import React from 'react'
import { Text, List, Link, EditButton } from '../dist'

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

      <List path='list' component='ul'>
        {(item, key) => (
          <li key={key}>
            {key}
          </li>
        )}
      </List>

      <Link href='/'>Back to frontpage</Link>

      <EditButton />
    </div>
  )
}]
