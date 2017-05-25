import React from 'react'
import { map } from 'lodash'

import ContentContainer from '../ContentContainer'
import EditIndicator from '../EditIndicator'

class EditPicker extends React.Component {
  static propTypes = {
    value: React.PropTypes.object,
    setValue: React.PropTypes.func.isRequired,
    components: React.PropTypes.object.isRequired
  }

  onChange = e => {
    this.props.setValue({ component: e.target.value })
  }

  preventDefault = e => {
    e.preventDefault()
  }

  render () {
    const { value, components, path } = this.props

    const componentOptions = map(components, (component, key) => <option value={key}>{key}</option>)

    const Component = value && value.component ? components[value.component] : null

    const componentPath = `${path}/componentValue`

    return (
      <span>
        <EditIndicator>
          <select
            onChange={this.onChange}
            value={value && value.component ? value.component : {}}
            children={componentOptions}
          />
        </EditIndicator>

        {Component && (
          <Component path={componentPath} />
        )}
      </span>
    )
  }
}

export default ContentContainer(EditPicker)
