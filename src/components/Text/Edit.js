import React from 'react'
import ContentEditable from 'react-contenteditable'

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

  overlay: {
    position: 'absolute',
    display: 'block',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 3,
    background: 'rgba(255, 255, 255, 1)',
    mixBlendMode: 'overlay',
    pointerEvents: 'none'
  }
}

export default class Text extends React.Component {
  static propTypes = {
    value: React.PropTypes.string,
    setValue: React.PropTypes.func.isRequired,
    placeholder: React.PropTypes.string
  };

  static defaultProps = {
    placeholder: ''
  };

  onChange (e) {
    this.props.setValue(e.target.value)
  }

  render () {
    const { value, placeholder } = this.props

    return (
      <div style={styles.container}>
        <ContentEditable
          style={styles.text}
          html={value || placeholder}
          onChange={::this.onChange}
        />

        <span style={styles.overlay} />
      </div>
    )
  }
}
