import React from 'react'
import { Text } from '../dist'
import Menu from './Menu'

export default class Frontpage extends React.Component {
  componentDidMount () {
    console.log('Frontpage mounted')
  }

  render () {
    return (
      <div>
        <h1>Book store</h1>
        <Menu />
        <Text path='introductions' placeholder='Introduction goes here' />
      </div>
    )
  }
}
