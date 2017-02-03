import React from 'react'
import { Text, Link, EditButton } from '../dist'

export default {
  aws: {
    s3Region: 'eu-west-1',
    s3Bucket: 'flatpack-tomorrow.iff.ninja',
    cognitoUserPoolId: 'eu-west-1_PoWmk0gLT',
    cognitoUserPoolClientId: '577epjsucc4pc5b294pupv3dd5',
    cognitoIdentityPoolId: 'eu-west-1:c138ec28-be42-42ca-aa56-50fcef6bb3eb'
  },

  routes: content => [{
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
        <Link href='/'>Back to frontpage</Link>
        <EditButton />
      </div>
    )
  }]
}
