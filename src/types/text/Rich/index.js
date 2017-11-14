import React, { Component } from 'react'
import { isKeyHotkey } from 'is-hotkey'
import { Editor } from 'slate-react'
import serializer from './serializer'
import FormatMenu from './FormatMenu'
import Box from '../../../ui/Box'

const DEFAULT_NODE = 'paragraph'

const isBoldHotkey = isKeyHotkey('mod+b')
const isItalicHotkey = isKeyHotkey('mod+i')
const isUnderlinedHotkey = isKeyHotkey('mod+u')

export default class extends Component {
  state = {
    value: this.getValue()
  }

  getValue () {
    if (this.props.value) {
      return serializer.deserialize(this.props.value)
    }

    return serializer.deserialize('<p></p>')
  }

  hasMark = (type) => {
    const { value } = this.state
    return value.activeMarks.some(mark => mark.type === type)
  }

  hasBlock = (type) => {
    const { value } = this.state
    return value.blocks.some(node => node.type === type)
  }

  onChange = ({ value }) => {
    this.setState({ value })
    this.props.onChange(serializer.serialize(value))
  }

  onKeyDown = (event, change) => {
    let mark

    if (isBoldHotkey(event)) {
      mark = 'bold'
    } else if (isItalicHotkey(event)) {
      mark = 'italic'
    } else if (isUnderlinedHotkey(event)) {
      mark = 'underlined'
    } else {
      return
    }

    event.preventDefault()
    change.toggleMark(mark)
    return true
  }

  onClickMark = (event, type) => {
    event.preventDefault()
    const { value } = this.state
    const change = value.change().toggleMark(type)
    this.onChange(change)
  }

  onClickBlock = (event, type) => {
    event.preventDefault()
    const { value } = this.state
    const change = value.change()
    const { document } = value

    if (type !== 'bullet-list' && type !== 'number-list') {
      const isActive = this.hasBlock(type)
      const isList = this.hasBlock('list-item')

      if (isList) {
        change
          .setBlock(isActive ? DEFAULT_NODE : type)
          .unwrapBlock('bullet-list')
          .unwrapBlock('number-list')
      } else {
        change.setBlock(isActive ? DEFAULT_NODE : type)
      }
    } else {
      const isList = this.hasBlock('list-item')
      const isType = value.blocks.some((block) => {
        return !!document.getClosest(block.key, parent => parent.type === type)
      })

      if (isList && isType) {
        change
          .setBlock(DEFAULT_NODE)
          .unwrapBlock('bullet-list')
          .unwrapBlock('number-list')
      } else if (isList) {
        change
          .unwrapBlock(type === 'bullet-list' ? 'number-list' : 'bullet-list')
          .wrapBlock(type)
      } else {
        change
          .setBlock('list-item')
          .wrapBlock(type)
      }
    }

    this.onChange(change)
  }

  render () {
    return (
      <Box title={this.props.label || 'Text'}>
        <FormatMenu
          onMarkButtonClick={this.onClickMark}
          onBlockButtonClick={this.onClickBlock}
          hasMark={this.hasMark}
          hasBlock={this.hasBlock}
        />

        {this.renderEditor()}
      </Box>
    )
  }

  renderEditor = () => {
    return (
      <Editor
        placeholder='Write text...'
        value={this.state.value}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
        renderNode={this.renderNode}
        renderMark={this.renderMark}
        style={{ lineHeight: 1.3 }}
        spellCheck
      />
    )
  }

  renderNode = (props) => {
    const { attributes, children, node } = props
    switch (node.type) {
      case 'paragraph': return <p {...attributes}>{children}</p>
      case 'heading-1': return <h1 {...attributes}>{children}</h1>
      case 'heading-2': return <h1 {...attributes}>{children}</h1>
      case 'bullet-list': return <ul {...attributes}>{children}</ul>
      case 'number-list': return <ol {...attributes}>{children}</ol>
      case 'list-item': return <li {...attributes}>{children}</li>
    }
  }

  renderMark = (props) => {
    const { children, mark } = props
    switch (mark.type) {
      case 'bold': return <b>{children}</b>
      case 'italic': return <i>{children}</i>
      case 'underlined': return <u>{children}</u>
    }
  }
}
