import React from 'react'

import ContentContainer from '../ContentContainer'
import EditIndicator from '../EditIndicator'

const styles = {
  container: {
    position: 'relative',
    display: 'block'
  },

  text: {
    position: 'relative',
    outline: 0,
    zIndex: 4
  }
}

class EditPlainText extends React.Component {
  static propTypes = {
    value: React.PropTypes.string,
    setValue: React.PropTypes.func.isRequired,
    placeholder: React.PropTypes.string
  }

  static defaultProps = {
    placeholder: ''
  }

  onChange = (e) => {
    this.props.setValue(e.target.value)
  }

  render () {
    const { value, placeholder } = this.props

    return (
      <EditIndicator>
        <span style={styles.container}>
          <input
            type='text'
            value={value || placeholder}
            onChange={::this.onChange}
          />
      </span>
      </EditIndicator>
    )
  }
}

export default ContentContainer(EditPlainText)
