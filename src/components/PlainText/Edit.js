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

  textarea: {
    all: 'inherit',
    width: '100%'
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

  onChange = e => {
    this.props.setValue(e.target.value.replace(/\n/gi, ' '))
  }

  onKeyDown = e => {
    if (e.keyCode === 13) {
      e.preventDefault()
    }
  }

  componentDidMount () {
    autosize(ReactDOM.findDOMNode(this.refs.textarea))
  }

  componentWillUnmount () {
    autosize.destroy(ReactDOM.findDOMNode(this.refs.textarea))
  }

  preventDefault = e => {
    e.preventDefault()
  }

  onContainerRef = ref => {
    if (ref) {
      this.containerRef = ref
      this.containerRef.addEventListener('click', this.preventDefault)
    } else if (this.containerRef) {
      this.containerRef.removeEventListener('click', this.preventDefault)
    }
  }

  render () {
    const { value, placeholder } = this.props

    return (
      <EditIndicator>
        <span style={styles.container} ref={this.onContainerRef}>
          <textarea
            style={styles.textarea}
            placeholder={placeholder}
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
            ref='textarea'
            value={value}
            rows={1}
          />
        </span>
      </EditIndicator>
    )
  }
}

export default ContentContainer(EditPlainText)
