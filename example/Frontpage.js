import React from 'react'
import Menu from './Menu'

export default class Frontpage extends React.Component {
  componentDidMount () {
    console.log('Frontpage mounted')
  }

  render () {
    return (
      <div>
        <Menu />
        Frontpage
      </div>
    )
  }
}
