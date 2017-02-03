import React from 'react'
import { Link, EditButton } from '../dist'

export default ({ children }) => (
  <div>
    <h1>Book store</h1>

    <ul>
      <li><Link href='/'>Frontpage</Link></li>
      <li><Link href='/books'>Books</Link></li>
    </ul>

    {children}

    <EditButton />
  </div>
)
