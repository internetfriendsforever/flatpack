import React, { Component } from 'react'
import { CognitoIdentityCredentials, CognitoIdentity } from 'aws-sdk/global'
import CognitoUserPool from 'amazon-cognito-identity-js/lib/CognitoUserPool'
import AuthenticationDetails from 'amazon-cognito-identity-js/lib/AuthenticationDetails'
import CognitoUser from 'amazon-cognito-identity-js/lib/CognitoUser'
import Button from '../ui/Button'
import Message from '../ui/Message'
import InputEmail from '../ui/InputEmail'
import InputPassword from '../ui/InputPassword'

console.log(CognitoIdentityCredentials)

const styles = {
  container: {
    padding: '5vw',
    maxWidth: 300,
    margin: '0 auto'
  }
}

function createCredentials (aws, username, session) {
  return new Promise((resolve, reject) => {
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
        reject(err)
      } else {
        resolve(credentials)
      }
    })
  })
}

export default class Auth extends Component {
  state = {
    username: '',
    password: '',
    credentials: null,
    fetchingCredentials: true,
    loggingIn: false,
    error: null
  }

  constructor (props) {
    super(props)

    this.pool = new CognitoUserPool({
      UserPoolId: this.props.aws.cognitoUserPoolId,
      ClientId: this.props.aws.cognitoUserPoolClientId
    })
  }

  componentDidMount () {
    const user = this.pool.getCurrentUser()

    if (user) {
      user.getSession((error, session) => {
        if (error) {
          this.setState({ error })
        } else {
          createCredentials(this.props.aws, user.username, session)
            .then(credentials => this.setState({
              credentials: credentials,
              fetchingCredentials: false
            }))
            .catch(error => this.setState({
              error: error,
              fetchingCredentials: false
            }))
        }
      })
    } else {
      this.setState({
        fetchingCredentials: false
      })
    }
  }

  onLoginSubmit = e => {
    e.preventDefault()

    const { username, password } = this.state

    this.setState({
      loggingIn: true,
      error: null
    })

    const user = new CognitoUser({
      Username: username,
      Pool: this.pool
    })

    const details = new AuthenticationDetails({
      Username: username,
      Password: password
    })

    user.authenticateUser(details, {
      onFailure: error => this.setState({
        loggingIn: false,
        error
      }),

      onSuccess: session => (
        createCredentials(this.props.aws, username, session)
          .then(credentials => this.setState({
            loggingIn: false,
            credentials
          }))
          .catch(error => this.setState({
            loggingIn: false,
            error
          }))
      )
    })
  }

  signOut = () => {
    const user = this.pool.getCurrentUser()

    if (user) {
      user.signOut()
      this.setState({
        credentials: null
      })
    }
  }

  onUsernameChange = e => this.setState({ username: e.currentTarget.value })
  onPasswordChange = e => this.setState({ password: e.currentTarget.value })

  render () {
    const { children } = this.props
    const { username, password, credentials, fetchingCredentials, loggingIn, error } = this.state

    if (credentials) {
      return children(credentials, this.signOut)
    }

    if (fetchingCredentials) {
      return null
    }

    return (
      <form style={styles.container} onSubmit={this.onLoginSubmit}>
        {error && (
          <Message critical>
            {error && error.message} 🤔
          </Message>
        )}

        <InputEmail
          label='E-mail'
          name='email'
          disabled={loggingIn}
          value={username}
          onChange={this.onUsernameChange}
        />

        <InputPassword
          label='Password'
          name='password'
          disabled={loggingIn}
          value={password}
          onChange={this.onPasswordChange}
        />

        <Button primary submit loading={loggingIn}>
          {loggingIn && 'Logging in…' || error && 'Try again' || 'Login'}
        </Button>
      </form>
    )
  }
}
