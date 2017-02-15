import React from 'react'
import { Editor, Raw } from 'slate'
import position from 'selection-position'

import EditIndicator from '../EditIndicator'
import FormatMenu from './FormatMenu'

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

const schema = {
  marks: {
    bold: props => <strong>{props.children}</strong>,
    code: props => <code>{props.children}</code>,
    italic: props => <em>{props.children}</em>,
    underlined: props => <u>{props.children}</u>
  },

  nodes: {
    paragraph: props => <p {...props.attributes}>{props.children}</p>
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

  state = {
    slateState: this.getSlateState()
  }

  componentDidMount = () => {
    this.updateFormatMenu()
  }

  componentDidUpdate = () => {
    this.updateFormatMenu()
  }

  onFormatMenuOpen = (portal) => {
    this.setState({ menuWrapper: portal.firstChild })
  }

  updateFormatMenu = () => {
    const { menuWrapper, slateState } = this.state

    if (!menuWrapper) return

    if (slateState.isBlurred || slateState.isCollapsed) {
      menuWrapper.style.display = 'none'
      return
    }

    const rect = position()
    menuWrapper.style.display = 'block'
    menuWrapper.style.top = `${rect.top + window.scrollY - menuWrapper.offsetHeight}px`
    menuWrapper.style.left = `${rect.left + window.scrollX - menuWrapper.offsetWidth / 2 + rect.width / 2}px`
  }

  hasMark = (type) => {
    const { slateState } = this.state
    return slateState.marks.some(mark => mark.type === type)
  }

  onClickMarkButton = (e, type) => {
    e.preventDefault()
    let { slateState } = this.state

    slateState = slateState
      .transform()
      .toggleMark(type)
      .apply()

    this.props.setValue(Raw.serialize(slateState, { terse: true }))
    this.setState({ slateState })
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

  onChange = (slateState) => {
    this.props.setValue(Raw.serialize(slateState, { terse: true }))
    this.setState({ slateState })
  }

  render () {
    const { slateState } = this.state

    return (
      <EditIndicator>
        <div style={styles.container}>
          <FormatMenu
            onClickMarkButton={this.onClickMarkButton}
            onFormatMenuOpen={this.onFormatMenuOpen}
            hasMark={this.hasMark}
          />

          <Editor
            schema={schema}
            state={slateState}
            onChange={::this.onChange}
            />
        </div>
      </EditIndicator>
    )
  }
}
