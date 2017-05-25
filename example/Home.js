import React from 'react'
import { PlainText, Text, Image, Link, EditButton } from '../dist'

export default class Home extends React.Component {
  render () {
    return (
      <div>
        <h1>
          <a href='' onMouseDown={() => console.log('mouse down')} onClick={() => console.log('click')}>
            <PlainText path='home/title' placeholder='Home title' />
          </a>
        </h1>

        <Image path='home/image' />
        <Image path='home/image2' />

        <hr />
        <h3><Link href='/picker/'>Mr. Picker! An exiting new feature.</Link></h3>
        <p><i>Because Pickers can’t be choosers!</i></p>

        <hr />
        <Text path='home/introduction' placeholder='This text is editable' />
        <Link href='/page2/'>Link to page 2</Link>
        <br />
        <Link href='/ingensteds'>Link to ingensteds</Link>
        <EditButton />
      </div>
    )
  }
}
