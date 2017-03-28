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
        <Text path='home/introduction' placeholder='This text is editable' />
        <Link href='/page2/'>Link to page 2</Link>
        <br />
        <Link href='/ingensteds'>Link to ingensteds</Link>
        <EditButton />
      </div>
    )
  }
}
