import React, { Component } from 'react'
import styled from 'styled-components'
import map from 'lodash/map'
import filter from 'lodash/filter'
import find from 'lodash/find'
import { getQuery, updateQuery } from '../utils/query'
import Root from '../ui/Root'
import Auth from './Auth'
import Group from '../types/components/Group'
import InputSelect from '../ui/InputSelect'
import Button from '../ui/Button'
import Preview from './Preview'
import publish from '../actions/publish'

const Editor = styled.div`
  display: flex;
  flex-direction: column;
  background: #F8F8F8;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`

const Split = styled.div`
  flex: auto;
  display: flex;
`

const Fields = styled.div`
  flex: auto;
  min-width: 350px;
  max-width: 350px;
  overflow: auto;
  display: flex;
  flex-direction: column;
`

const DataFields = styled.div`
  flex: 1 1 auto;
  padding: 10px;
`

const Publish = styled.div`
  flex: 0 0 auto;
  padding: 0.25em;
  background: #5B5E6C;
`

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
`

const Action = styled.div`
  flex: 0 0 auto;
  margin: 0.25em;
`

export default class extends Component {
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

  renderEditor = auth => {
    const { routes } = this.props
    const { value, publishing } = this.state
    const previewPath = getQuery().preview || '/'
    const currentRoutes = routes(value)
    const route = find(currentRoutes, { path: previewPath })

    return (
      <Root>
        <Editor>
          <Split>
            <Preview
              route={route}
              onNavigate={this.onPreviewNavigate}
            />

            <Fields>
              <DataFields>
                <InputSelect label='Preview' value={previewPath} onChange={this.onPreviewPathSelectChange}>
                  {map(currentRoutes, route => (
                    <option key={route.path}>{route.path}</option>
                  ))}
                </InputSelect>

                <Group
                  segments={this.getSegments()}
                  resolved={[]}
                  fields={this.props.fields}
                  value={this.state.value}
                  onChange={this.onValueChange}
                />
              </DataFields>

              {auth && (
                <Publish>
                  <Actions>
                    <Action>
                      <Button onClick={auth.signOut}>
                        Sign out
                      </Button>
                    </Action>

                    <Action>
                      <Button
                        disabled={publishing}
                        onClick={this.onPublishClick.bind(this, auth.credentials)}
                        children={publishing ? 'Publishing…' : 'Publish'}
                        primary
                      />
                    </Action>
                  </Actions>
                </Publish>
              )}
            </Fields>
          </Split>
        </Editor>
      </Root>
    )
  }

  render () {
    const { aws } = this.props

    if (aws) {
      return (
        <Auth aws={aws}>
          {this.renderEditor}
        </Auth>
      )
    } else {
      return this.renderEditor()
    }
  }
}
