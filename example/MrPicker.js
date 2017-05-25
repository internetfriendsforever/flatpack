import React from 'react'
import { PlainText, Text, Image, Picker, EditButton, List, ListItem } from '../dist'

export default class Home extends React.Component {
  render () {
    const components = {
      'Plain text': PlainText,
      'Image': Image,
      'Rich text': Text
    }

    return (
      <div>
        <h1>
          Picker
        </h1>
        <h2>List of pickers</h2>
        <List path='posts' reverse>
          {(key, item) => (
            <ListItem key={key}>
              <Picker
                path={`posts/${key}/picker`}
                components={components}
                />
            </ListItem>
          )}
        </List>

        <hr />

        <Picker
          path='mrpicker/test'
          components={components}
          />
        <Picker
          path='mrpicker_dos/test'
          components={components}
          />
        <EditButton />
      </div>
    )
  }
}
