import React from 'react'
import { Text } from '../dist'
import Layout from './Layout'
import circle from './circle.png'

export default class Frontpage extends React.Component {
  render () {
    return (
      <Layout>
        <img src={circle} />
        <Text path='introductions' placeholder='Introduction goes here' />
      </Layout>
    )
  }
}
