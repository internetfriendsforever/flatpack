import React from 'react'

import Switch from './Switch'

import Button from './Button'
import { Dropdown, DropdownToggle, DropdownContent } from './Dropdown'
import { colors } from './constants'
import { toggleEditing } from '../../actions/editor'
import { signOut } from '../../actions/authentication'

const styles = {
  menu: {
    background: '#5B5E6C',
    fontSize: '0.875em',
    position: 'fixed',
    display: 'flex',
    left: 0,
    top: 0,
    right: 0,
    zIndex: 10,
    alignItems: 'stretch',
    justifyContent: 'flex-end',
    border: `1px solid ${colors.darkSlate.setAlpha(0.5)}`
  },

  toggle: {
    width: '50px',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    borderLeft: '1px solid',
    borderLeftColor: colors.darkSlate.setAlpha(0.5)
  },

  toggleActive: {
    background: colors.darkSlate,
    borderLeftColor: colors.darkSlate
  },

  logo: {
    fill: colors.darkSlate,
    flex: 'auto',
    pointerEvents: 'none'
  },

  logoActive: {
    fill: 'white'
  },

  dropdown: {
    flexGrow: 0
  },

  dropdownContent: {
    background: colors.darkSlate
  },

  tools: {
    flex: 'auto',
    display: 'flex',
    alignItems: 'middle',
    justifyContent: 'space-between'
  },

  toolGroup: {
    flex: 'auto',
    flexGrow: 0,
    display: 'flex',
    padding: '0 0.5em',
    alignItems: 'center'
  },

  menuLink: {
    display: 'block',
    cursor: 'pointer',
    padding: '0.875em'
  }
}

export default class Toolbar extends React.Component {
  static propTypes = {
    changes: React.PropTypes.bool.isRequired,
    discard: React.PropTypes.func.isRequired,
    publish: React.PropTypes.func.isRequired
  };

  static contextTypes = {
    flatpack: React.PropTypes.object
  }

  state = {
    dropdownActive: false
  }

  onSignOut () {
    const { aws } = this.context.flatpack.config
    const action = signOut(aws)
    this.context.flatpack.store.dispatch(action)
  }

  toggleDropdown (toggle) {
    this.setState({
      dropdownActive: toggle
    })
  }

  toggleEdit () {
    this.context.flatpack.store.dispatch(toggleEditing())
  }

  render () {
    const state = this.context.flatpack.store.getState()
    const { editing } = state.editor
    const { credentials } = state.authentication
    const { dropdownActive } = this.state
    const { changes, discard, publish } = this.props

    const toggleStyle = {
      ...styles.toggle,
      ...(dropdownActive && styles.toggleActive)
    }

    const logoStyle = {
      ...styles.logo,
      ...(dropdownActive && styles.logoActive)
    }

    return (
      <div style={styles.menu}>
        {credentials && (
          <div style={styles.tools}>
            <div style={styles.toolGroup}>
              <Switch label='Edit' checked={editing} onClick={::this.toggleEdit} />
            </div>

            {changes && (
              <div style={styles.toolGroup}>
                <Button secondary onClick={discard} label={'Discard changes'} />
                <Button onClick={publish} label={'Publish'} />
              </div>
            )}
          </div>
        )}

        <Dropdown onToggle={::this.toggleDropdown} open={dropdownActive}>
          <DropdownToggle style={toggleStyle}>
            <svg style={logoStyle} id='logo' width='20px' height='20px' viewBox='0 0 100 100' version='1.1' xmlns='http://www.w3.org/2000/svg'>
              <path id='umbraco-white' stroke='none' fillRule='evenodd' d='M50,100 C77.6142375,100 100,77.6142375 100,50 C100,22.3857625 77.6142375,0 50,0 C22.3857625,0 0,22.3857625 0,50 C0,77.6142375 22.3857625,100 50,100 Z M50.0449037,12.4 L82.5898074,31.1898089 L82.5898074,68.7694268 L50.0449037,87.5592357 L17.5,68.7694268 L17.5,31.1898089 L50.0449037,12.4 Z'></path>
            </svg>
          </DropdownToggle>
          <DropdownContent style={styles.dropdownContent}>
            <nav>
              <a style={styles.menuLink} onClick={::this.onSignOut}>
                Sign out <small>({credentials.params.LoginId})</small>
              </a>
            </nav>
          </DropdownContent>
        </Dropdown>
      </div>
    )
  }
}
