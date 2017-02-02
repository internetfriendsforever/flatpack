import { CognitoIdentityCredentials, CognitoIdentity } from 'aws-sdk'
import { CognitoUserPool, AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js'

import {
  cognitoIdentityPoolId,
  cognitoUserPoolId,
  cognitoUserPoolClientId
} from '../constants'

const pool = new CognitoUserPool({
  UserPoolId: cognitoUserPoolId,
  ClientId: cognitoUserPoolClientId
})

export const fetchCredentials = (username, password) => dispatch => {
  const user = pool.getCurrentUser()

  dispatch({
    type: 'FETCH_CREDENTIALS'
  })

  if (user) {
    user.getSession((err, session) => {
      if (err) {
        dispatch({
          type: 'FETCH_CREDENTIALS_FAILURE'
        })
      } else {
        createCredentials(user.username, session, credentials => (
          dispatch({
            type: 'FETCH_CREDENTIALS_SUCCESS',
            credentials
          })
        ))
      }
    })
  } else {
    dispatch({
      type: 'FETCH_CREDENTIALS_FAILURE'
    })
  }
}

export const signIn = (username, password) => dispatch => {
  dispatch({
    type: 'SIGN_IN'
  })

  const user = new CognitoUser({
    Username: username,
    Pool: pool
  })

  const details = new AuthenticationDetails({
    Username: username,
    Password: password
  })

  user.authenticateUser(details, {
    onSuccess: session => {
      createCredentials(username, session, credentials => (
        dispatch({
          type: 'SIGN_IN_SUCCESS',
          credentials,
          username
        })
      ))
    },

    onFailure: error => {
      dispatch({
        type: 'SIGN_IN_ERROR',
        error
      })
    }
  })
}

export const signOut = () => dispatch => {
  const user = pool.getCurrentUser()

  if (user) {
    user.signOut()
  }

  dispatch({
    type: 'SIGN_OUT'
  })
}

function createCredentials (username, session, callback) {
  const cognitoRegion = cognitoUserPoolId.split('_')[0]
  const cognitoProviderName = `cognito-idp.${cognitoRegion}.amazonaws.com/${cognitoUserPoolId}`

  const credentials = new CognitoIdentityCredentials({
    IdentityPoolId: cognitoIdentityPoolId,
    LoginId: username,
    Logins: {
      [cognitoProviderName]: session.getIdToken().getJwtToken()
    }
  })

  credentials.cognito = new CognitoIdentity({
    region: cognitoRegion,
    params: credentials.params
  })

  credentials.refresh(err => {
    if (err) {
      console.log(err)
    } else {
      callback(credentials)
    }
  })
}
