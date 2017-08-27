import React, { Component } from 'react'
import map from 'lodash/map'
import filter from 'lodash/filter'
import setInObject from 'lodash/set'
import find from 'lodash/find'
import difference from 'lodash/difference'
import keys from 'lodash/keys'
import { getQuery, updateQuery } from '../utils/query'
import Setup from './Setup'
import Auth from './Auth'
import Group from '../types/components/Group'
import Button from '../ui/Button'
import Preview from './Preview'
import publish from '../actions/publish'

const styles = {
  container: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    fontSize: 14
  },

  editor: {
    display: 'flex',
    background: '#f6f6f6',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },

  fields: {
    flex: 'auto',
    overflow: 'auto',
    width: 300,
    padding: 20,
    paddingLeft: 10
  },

  preview: {
    flex: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'middle',
    alignItems: 'middle',
    padding: 20,
    paddingRight: 10
  },

  iframe: {
    flex: 'auto',
    background: 'white'
  }
}

const requiredAWSKeys = [
  's3Region',
  's3Bucket',
  'cognitoUserPoolId',
  'cognitoUserPoolClientId',
  'cognitoIdentityPoolId'
]

export default class Editor extends Component {
  state = {
    publishing: false,
    value: {}
  }

  constructor (props) {
    super(props)

    if (props.value) {
      this.state.value = props.value
    }
  }

  onValueAtPathChange = (path, value) => {
    const modified = { ...this.state.value }
    setInObject(modified, path, value)
    this.setState({ value: modified })
  }

  onValueChange = value => {
    this.setState({ value })
  }

  updatePreviewPath (path) {
    updateQuery({
      preview: path !== '/' ? path : ''
    })
  }

  onPreviewPathSelectChange = e => this.updatePreviewPath(e.currentTarget.value)
  onPreviewNavigate = path => this.updatePreviewPath(path)

  onPublishClick = credentials => {
    const { value } = this.state

    this.setState({
      publishing: true
    })

    publish({
      ...this.props,
      credentials,
      value
    }).then(() => {
      console.log('Published')
      this.setState({
        publishing: false
      })
    }).catch(e => {
      console.log(e)
      this.setState({
        publishing: false
      })
    })
  }

  getSegments () {
    return filter((getQuery().path || '').split('/'))
  }

  render () {
    const { value, publishing } = this.state
    const { aws, routes } = this.props
    const previewPath = getQuery().preview || '/'
    const currentRoutes = routes(value)
    const route = find(currentRoutes, { path: previewPath })

    if (difference(requiredAWSKeys, keys(aws)).length) {
      return <Setup />
    }

    return (
      <div style={styles.container}>
        <Auth aws={aws}>
          {(credentials, signOut) => (
            <div style={styles.editor}>
              <div style={styles.preview}>
                <select value={previewPath} onChange={this.onPreviewPathSelectChange}>
                  {map(currentRoutes, route => (
                    <option key={route.path}>{route.path}</option>
                  ))}
                </select>

                <Preview route={route} onNavigate={this.onPreviewNavigate} />
              </div>

              <div style={styles.fields}>
                <Group
                  segments={this.getSegments()}
                  resolved={[]}
                  fields={this.props.fields}
                  value={this.state.value}
                  onChange={this.onValueChange}
                />

                <Button onClick={this.onPublishClick.bind(this, credentials)} disabled={publishing} primary>
                  {publishing ? 'Publishing…' : 'Publish'}
                </Button>

                <Button onClick={signOut}>
                  Sign out
                </Button>
              </div>
            </div>
          )}
        </Auth>
      </div>
    )
  }
}
