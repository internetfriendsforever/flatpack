import React, { Component } from 'react'
import map from 'lodash/map'
import find from 'lodash/find'
import difference from 'lodash/difference'
import keys from 'lodash/keys'
import Setup from './Setup'
import Auth from './Auth'
import Fields from './Fields'
import Button from '../ui/Button'

const isUrlExternal = url => {
  const domain = url => url.replace('http://', '').replace('https://', '').split('/')[0]
  return domain(window.location.href) !== domain(url)
}

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
    maxWidth: 400,
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
    user: null,
    previewPath: '/',
    value: {}
  }

  constructor (props) {
    super(props)

    if (props.value) {
      this.state.value = props.value
    }
  }

  onChange = (value) => {
    this.setState({
      value
    })
  }

  updatePreview () {
    const { value, previewPath } = this.state
    const routes = this.props.router(value)
    const route = find(routes, { path: previewPath })
    route.render(this.iframe.contentDocument)
  }

  componentDidUpdate () {
    this.updatePreview()
  }

  onIframeRef = node => {
    if (node) {
      this.iframe = node
      this.onIframeLoad()
    }
  }

  onIframeLoad = () => {
    this.updatePreview()
    this.iframe.contentDocument.addEventListener('click', this.onIframeClick)
  }

  onIframeClick = (e) => {
    const link = e.target.closest('a')

    if (link) {
      e.preventDefault()

      if (!isUrlExternal(link.href)) {
        const { pathname, search = '', hash = '' } = link

        this.setState({
          previewPath: `${pathname}${search}${hash}`
        })
      } else {
        window.open(link.href)
      }
    }
  }

  onPreviewPathChange = (e) => {
    this.setState({
      previewPath: e.currentTarget.value
    })
  }

  onPublishClick = () => {
    console.log('Publish!')
  }

  render () {
    const { previewPath, value } = this.state
    const { aws, fields, router } = this.props

    if (difference(requiredAWSKeys, keys(aws)).length) {
      return <Setup />
    }

    return (
      <div style={styles.container}>
        <Auth aws={aws}>
          {(credentials, signOut) => (
            <div style={styles.editor}>
              <div style={styles.preview}>
                <select value={previewPath} onChange={this.onPreviewPathChange}>
                  {map(router(value), route => (
                    <option key={route.path}>{route.path}</option>
                  ))}
                </select>
                <iframe
                  style={styles.iframe}
                  ref={this.onIframeRef}
                />
              </div>

              <div style={styles.fields}>
                <Fields fields={fields} value={value} onChange={this.onChange} />
                <Button onClick={this.onPublishClick} primary>
                  Publish
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
