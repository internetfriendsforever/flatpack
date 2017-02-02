import React from 'react'
import { find } from 'lodash'

const styles = {
  container: {
    position: 'relative'
  },

  toggle: {
    cursor: 'pointer'
  },

  content: {
    position: 'absolute',
    top: '100%',
    right: '0'
  }
}

export const DropdownToggle = ({ children, style }) => (
  <div style={style}>{children}</div>
)

export const DropdownContent = ({ children, style }) => (
  <div style={style}>{children}</div>
)

export class Dropdown extends React.Component {
  static propTypes = {
    open: React.PropTypes.bool,
    onToggle: React.PropTypes.func,
    children: React.PropTypes.any,
    style: React.PropTypes.object
  }

  static defaultProps = {
    open: false
  }

  constructor (props) {
    super(props)

    this.closeIfOutside = ::this.closeIfOutside

    this.state = {
      open: props.open
    }
  }

  componentDidMount () {
    this.mounted = true
  }

  componentWillReceiveProps (nextProps) {
    if ('open' in nextProps) {
      this.setState({
        open: nextProps.open
      })
    }
  }

  componentWillUnmount () {
    this.mounted = false
  }

  open () {
    this.setState({ open: true })
    document.addEventListener('mousedown', this.closeIfOutside)
    this.props.onToggle && this.props.onToggle(true)
  }

  close () {
    this.setState({ open: false })
    document.removeEventListener('mousedown', this.closeIfOutside)
    this.props.onToggle && this.props.onToggle(false)
  }

  closeIfOutside (e) {
    if (this.mounted && !this.DOMElement.contains(e.target)) {
      this.close()
    }
  }

  setDOMElement (DOMElement) {
    this.DOMElement = DOMElement
  }

  render () {
    const children = React.Children.toArray(this.props.children)
    const { open } = this.state
    const toggle = ::this[open ? 'close' : 'open']

    const containerStyle = {
      ...styles.container,
      ...this.props.style
    }

    const toggleComponent = find(children, child => child.type === DropdownToggle)
    const contentComponent = find(children, child => child.type === DropdownContent)

    return (
      <div ref={::this.setDOMElement} style={containerStyle}>
        <div style={styles.toggle} onClick={toggle}>
          {toggleComponent}
        </div>

        {open && (
          <div style={styles.content}>
            {contentComponent}
          </div>
        )}
      </div>
    )
  }
}
