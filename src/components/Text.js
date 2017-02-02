import React from 'react'
import ContentEditable from 'react-contenteditable'

import { set } from '../actions/content'

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
    path: React.PropTypes.string.isRequired,
    placeholder: React.PropTypes.string
  };

  static contextTypes = {
    flatpack: React.PropTypes.object
  };

  static defaultProps = {
    placeholder: ''
  };

  onChange (e) {
    this.context.flatpack.store.dispatch(set(this.props.path, e.target.value))
  }

  render () {
    const { placeholder } = this.props
    const edit = this.context.flatpack.store.getState().editor.editing
    const value = this.context.flatpack.store.getContent(this.props.path)

    const style = {
      ...(edit && styles.text)
    }

    return (
      <span style={styles.container}>
        <ContentEditable
          style={style}
          html={value || placeholder}
          disabled={!edit}
          onChange={::this.onChange}
        />

        {edit && (
          <span style={styles.overlay} />
        )}
      </span>
    )
  }
}
