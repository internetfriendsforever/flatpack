import React from 'react'
import { Editor, Raw } from 'slate'
import position from 'selection-position'

import ContentContainer from '../ContentContainer'
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
    bold: props => <b>{props.children}</b>,
    italic: props => <i>{props.children}</i>,
    code: props => <code>{props.children}</code>,
    underlined: props => <u>{props.children}</u>
  },

  nodes: {
    paragraph: props => <p {...props.attributes}>{props.children}</p>,
    heading1: props => <h1 {...props.attributes}>{props.children}</h1>,
    heading2: props => <h2 {...props.attributes}>{props.children}</h2>,
    heading3: props => <h3 {...props.attributes}>{props.children}</h3>,
    heading4: props => <h4 {...props.attributes}>{props.children}</h4>,
    link: (props) => {
      const { data } = props.node
      const href = data.get('href')
      return <a href={href} {...props.attributes}>{props.children}</a>
    }
  }
}

class EditText extends React.Component {
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

    function getMenuPosition () {
      const rect = position()

      if (window.innerWidth - rect.left < menuWrapper.offsetWidth / 2) {
        // Outside right screen
        return {
          top: `${rect.top + window.scrollY - menuWrapper.offsetHeight}px`,
          left: `${window.innerWidth - menuWrapper.offsetWidth}px`
        }
      }

      if (rect.left < menuWrapper.offsetWidth / 2 - rect.width / 2) {
        // Outside left screen
        return {
          top: `${rect.top + window.scrollY - menuWrapper.offsetHeight}px`,
          left: `${window.scrollX}px`
        }
      }

      return {
        top: `${rect.top + window.scrollY - menuWrapper.offsetHeight}px`,
        left: `${rect.left + window.scrollX - menuWrapper.offsetWidth / 2 + rect.width / 2}px`
      }
    }

    menuWrapper.style.display = 'block'
    menuWrapper.style.top = getMenuPosition().top
    menuWrapper.style.left = getMenuPosition().left
  }

  hasMark = (type) => {
    const { slateState } = this.state
    return slateState.marks.some(mark => mark.type === type)
  }

  hasLink = () => {
    const { slateState } = this.state
    return slateState.inlines.some(inline => inline.type === 'link')
  }

  isBlock = (type) => {
    const { slateState } = this.state
    return slateState.blocks.some(block => block.type === type)
  }

  onMarkButtonClick = (e, type) => {
    e.preventDefault()
    let { slateState } = this.state

    slateState = slateState
      .transform()
      .toggleMark(type)
      .apply()

    this.props.setValue(Raw.serialize(slateState, { terse: true }))
    this.setState({ slateState })
  }

  onLinkButtonClick = (e, type) => {
    e.preventDefault()
    let { slateState } = this.state
    const hasLink = this.hasLink()

    if (hasLink) {
      slateState = slateState
        .transform()
        .unwrapInline('link')
        .apply()
    } else if (slateState.isExpanded) {
      const href = window.prompt('Enter link URL')

      slateState = slateState
        .transform()
        .wrapInline({
          type: 'link',
          data: { href }
        })
        .collapseToEnd()
        .apply()
    } else {
      const href = window.prompt('Enter link URL')
      const text = window.prompt('Enter link text')

      slateState = slateState
        .transform()
        .insertText(text)
        .extendBackward(text.length)
        .wrapInline({
          type: 'link',
          data: { href }
        })
        .collapseToEnd()
        .apply()
    }

    this.props.setValue(Raw.serialize(slateState, { terse: true }))
    this.setState({ slateState })
  }

  onBlockButtonClick = (e, type) => {
    e.preventDefault()
    let { slateState } = this.state

    slateState = slateState
      .transform()
      .setBlock(type)
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
            onMarkButtonClick={this.onMarkButtonClick}
            onBlockButtonClick={this.onBlockButtonClick}
            onLinkButtonClick={this.onLinkButtonClick}
            onFormatMenuOpen={this.onFormatMenuOpen}
            hasMark={this.hasMark}
            hasLink={this.hasLink}
            isBlock={this.isBlock}
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

export default ContentContainer(EditText)
