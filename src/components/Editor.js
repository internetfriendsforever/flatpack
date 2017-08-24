import React, { Component } from 'react'
import map from 'lodash/map'
import getInObject from 'lodash/get'
import setInObject from 'lodash/set'
import find from 'lodash/find'
import difference from 'lodash/difference'
import keys from 'lodash/keys'
import { getQuery, updateQuery } from '../utils/query'
import Setup from './Setup'
import Auth from './Auth'
import Fields from './Fields'
import Button from '../ui/Button'
import FieldLink from './FieldLink'
import Preview from './Preview'
import publish from '../actions/publish'
import pack from '../actions/pack'

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

  componentDidMount () {
    console.log('Editor mounted')
  }

  componentWillUnmount () {
    console.log('Editor will unmount')
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
    const { aws, routes, manifest, path } = this.props
    const { value } = this.state

    pack({
      path,
      manifest,
      routes,
      value
    }).then(files => publish({
      files,
      credentials,
      aws
    }).then(() => {
      this.setState({
        publishing: false
      })
    }).catch(() => {
      this.setState({
        publishing: false
      })
    }))

    this.setState({
      publishing: true
    })
  }

  getFieldPath () {
    return getQuery().content
  }

  renderFieldPathNavigation () {
    const { fields } = this.props
    const path = this.getFieldPath()
    const segments = path.split('.')

    const items = segments.map((key, i) => {
      const path = segments.slice(0, i + 1).join('.')
      const field = getInObject(fields, path)
      return {
        path,
        label: field.props.label || key
      }
    })

    if (items.length) {
      items.unshift({
        path: '',
        label: 'Content'
      })
    }

    return (
      <div>
        {map(items, ({ path, label }, i) => (
          <span key={path}>
            {(i < items.length - 1) && (
              <span>
                <FieldLink path={path}>
                  {label}
                </FieldLink>
                <span>{' › '}</span>
              </span>
            ) || (
              <span>{label}</span>
            )}
          </span>
        ))}
      </div>
    )
  }

  renderFields () {
    const { value } = this.state
    const { fields } = this.props
    const fieldPath = this.getFieldPath()

    if (fieldPath) {
      const pathField = getInObject(fields, fieldPath)
      const pathValue = getInObject(value, fieldPath)
      const { components, props, ...children } = pathField
      const Component = components.default

      return (
        <div>
          {this.renderFieldPathNavigation()}
          <Component
            path={fieldPath}
            value={pathValue}
            fields={children}
            onChange={this.onValueAtPathChange.bind(this, fieldPath)}
            {...props}
          />
        </div>
      )
    } else {
      return (
        <Fields
          fields={this.props.fields}
          value={this.state.value}
          onChange={this.onValueChange}
        />
      )
    }
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
                {this.renderFields()}

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
