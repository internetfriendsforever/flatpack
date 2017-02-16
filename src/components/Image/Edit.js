import React from 'react'
import { first } from 'lodash'

import Image from './Image'
import ContentContainer from '../ContentContainer'
import DOMComponent from '../DOMComponent'

const styles = {
  container: {
    border: '1px blue solid',
    minHeight: 50,
    minWidth: 50
  },

  dragOver: {
    background: 'yellow'
  }
}

class EditImage extends React.Component {
  static propTypes = {
    value: React.PropTypes.object,
    setValue: React.PropTypes.func.isRequired,
    attrs: React.PropTypes.object
  }

  static defaultProps = {
    value: {},
    attrs: {}
  }

  state = {
    dragOver: false,
    preview: null
  }

  componentWillReceiveProps (nextProps) {
  }

  onDragOver = e => {
    e.stopPropagation()
    e.preventDefault()

    this.setState({
      dragOver: true
    })
  }

  onDragLeave = e => {
    this.setState({
      dragOver: false
    })
  }

  onDrop = e => {
    e.preventDefault()

    const file = first(e.dataTransfer.files)

    if (file) {
      const imagePattern = /^image\//

      if (imagePattern.test(file.type)) {
        this.props.setValue({
          url: file
        })
      } else {
        this.onDropError()
      }
    } else {
      this.onDropError()
    }

    this.setState({
      dragOver: false
    })
  }

  onDropError () {
    // TODO: Notify user of wrong filetype
    console.log('Not an image')
  }

  render () {
    const { dragOver } = this.state

    const style = {
      ...this.props.attrs.style,
      ...styles.container,
      ...(dragOver && styles.dragOver)
    }

    const attrs = {
      ...this.props.attrs,
      style,
      onDrop: this.onDrop,
      onDragOver: this.onDragOver,
      onDragLeave: this.onDragLeave
    }

    return (
      <DOMComponent {...this.props} attrs={attrs}>
        <Image value={this.props.value} />
      </DOMComponent>
    )
  }
}

export default ContentContainer(EditImage)