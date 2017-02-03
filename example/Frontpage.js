import React from 'react'
import { Text } from '../dist'
import Layout from './Layout'

export default class Frontpage extends React.Component {
  componentDidMount () {
    console.log('Frontpage mounted')
  }

  render () {
    return (
      <Layout>
        <Text path='introductions' placeholder='Introduction goes here' />
      </Layout>
    )
  }
}
