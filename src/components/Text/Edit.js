import React from 'react'
import { Editor, Raw } from 'slate'

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

export default class EditText extends React.Component {
  static propTypes = {
    value: React.PropTypes.object,
    setValue: React.PropTypes.func.isRequired,
    placeholder: React.PropTypes.string
  }

  static defaultProps = {
    placeholder: ''
  }

  getSlateState () {
    if (this.props.value) {
      return Raw.deserialize(this.props.value, { terse: true })
    }
    return Raw.deserialize({
      nodes: [
        {
          kind: 'block',
          type: 'paragraph',
          nodes: [
            {
              kind: 'text',
              text: this.props.placeholder
            }
          ]
        }
      ]
    }, { terse: true })
  }

  state = {
    slateState: this.getSlateState()
  }

  onChange = (slateState) => {
    this.props.setValue(Raw.serialize(slateState, { terse: true }))

    this.setState({ slateState })
  }

  render () {
    return (
      <div style={styles.container}>
        <Editor
          state={this.state.slateState}
          onChange={::this.onChange}
          />
        <span style={styles.overlay} />
      </div>
    )
  }
}
