import React from 'react'

import Input from './Input'
import Button from './Button'
import { signIn } from '../../actions/authentication'

const styles = {
  container: {
    minWidth: '18em',
    maxWidth: '22em',
    margin: 0
  },

  header: {
    fontSize: '1em',
    height: '4em'
  },

  button: {
    margin: '1.5em 0'
  }
}

export default class SignIn extends React.Component {
  static contextTypes = {
    flatpack: React.PropTypes.object
  }

  constructor (props) {
    super(props)

    this.onUsernameChange = this.onInputChange.bind(this, 'username')
    this.onPasswordChange = this.onInputChange.bind(this, 'password')

    this.state = {
      username: '',
      password: ''
    }
  }

  onSubmit (e) {
    e.preventDefault()
    const { username, password } = this.state
    this.context.flatpack.store.dispatch(signIn(username, password))
  }

  onInputChange (key, e) {
    this.setState({
      [key]: e.currentTarget.value
    })
  }

  onShowPasswordChange (e) {
    this.setState({
      showPassword: e.currentTarget.checked
    })
  }

  render () {
    const { signingIn, error } = this.context.flatpack.store.getState().authentication
    const { username, password } = this.state

    return (
      <form style={styles.container} onSubmit={::this.onSubmit}>
        {false && (
          <h3 style={styles.header}>Log in</h3>
        )}

        <Input name='email' type='email' value={username} label='Email' onChange={::this.onUsernameChange} />
        <Input name='password' mask value={password} label='Password' onChange={::this.onPasswordChange} />

        <Button block submit style={styles.button} label={signingIn ? 'Signing in…' : 'Sign in'} />

        {error && (
          <div>{error.toString()}</div>
        )}
      </form>
    )
  }
}
