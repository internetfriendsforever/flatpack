import { CognitoIdentityCredentials, CognitoIdentity } from 'aws-sdk'
import { CognitoUserPool, AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js'

const getPool = aws => new CognitoUserPool({
  UserPoolId: aws.cognitoUserPoolId,
  ClientId: aws.cognitoUserPoolClientId
})

export const fetchCredentials = (aws) => dispatch => {
  const user = getPool(aws).getCurrentUser()

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
        createCredentials(aws, user.username, session, credentials => (
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

export const signIn = (aws, username, password) => dispatch => {
  dispatch({
    type: 'SIGN_IN'
  })

  const user = new CognitoUser({
    Username: username,
    Pool: getPool(aws)
  })

  const details = new AuthenticationDetails({
    Username: username,
    Password: password
  })

  user.authenticateUser(details, {
    onSuccess: session => {
      createCredentials(aws, username, session, credentials => (
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

export const signOut = aws => dispatch => {
  const user = getPool(aws).getCurrentUser()

  if (user) {
    user.signOut()
  }

  dispatch({
    type: 'SIGN_OUT'
  })
}

function createCredentials (aws, username, session, callback) {
  const cognitoRegion = aws.cognitoUserPoolId.split('_')[0]
  const cognitoProviderName = `cognito-idp.${cognitoRegion}.amazonaws.com/${aws.cognitoUserPoolId}`

  const credentials = new CognitoIdentityCredentials({
    IdentityPoolId: aws.cognitoIdentityPoolId,
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
