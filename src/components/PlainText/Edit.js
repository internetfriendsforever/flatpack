import React from 'react'
import ReactDOM from 'react-dom'
import autosize from 'autosize'

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
  },

  input: {
    all: 'inherit'
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

  componentDidMount () {
    autosize(ReactDOM.findDOMNode(this.refs.textarea))
  }

  render () {
    const { value, placeholder } = this.props

    return (
      <EditIndicator>
        <span style={styles.container}>
          <textarea
            style={styles.input}
            placeholder={placeholder}
            onChange={::this.onChange}
            ref='textarea'
          >
            {value}
          </textarea>
        </span>
      </EditIndicator>
    )
  }
}

export default ContentContainer(EditPlainText)
