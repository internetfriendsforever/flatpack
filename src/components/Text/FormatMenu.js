import React from 'react'
import Portal from 'react-portal'

const styles = {
  menuWrapper: {
    zIndex: 5,
    position: 'absolute',
    fontFamily: 'Iosevka, monospaced',
    fontSize: '0.8em'
  },

  menu: {
    background: '#5B5E6D',
    border: '1px solid #414554',
    borderRadius: '2px',
    padding: 5,
    display: 'flex'
  },

  markButton: {
    width: 22,
    height: 22,
    lineHeight: '22px',
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.7)',
    cursor: 'pointer',
    flex: 1
  },

  markButtonActive: {
    color: 'white',
    background: '#414554'
  },

  blockButton: {
    width: 22,
    height: 22,
    lineHeight: '22px',
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.7)',
    cursor: 'pointer',
    flex: 1,
    background: '#9C9EA7'
  },

  blockButtonActive: {
    color: 'black'
  }
}

export default class FormatMenu extends React.Component {
  static propTypes = {
    onMarkButtonClick: React.PropTypes.func.isRequired,
    onBlockButtonClick: React.PropTypes.func.isRequired,
    onFormatMenuOpen: React.PropTypes.func.isRequired,
    hasMark: React.PropTypes.func.isRequired
  }

  renderMarkButton = (type, icon) => {
    const isActive = this.props.hasMark(type)
    const onMouseDown = e => this.props.onMarkButtonClick(e, type)

    const style = {
      ...styles.markButton,
      ...(isActive && {...styles.markButtonActive})
    }

    return (
      <span onMouseDown={onMouseDown} style={style}>
        <span>{icon}</span>
      </span>
    )
  }

  renderLinkButton = (type, icon) => {
    const isActive = this.props.hasLink()
    const onMouseDown = e => this.props.onLinkButtonClick(e, type)

    const style = {
      ...styles.markButton,
      ...(isActive && {...styles.markButtonActive})
    }

    return (
      <span onMouseDown={onMouseDown} style={style}>
        <span>{icon}</span>
      </span>
    )
  }

  renderBlockButton = (type, icon) => {
    const isActive = this.props.isBlock(type)
    const onMouseDown = e => this.props.onBlockButtonClick(e, type)

    const style = {
      ...styles.blockButton,
      ...(isActive && {...styles.blockButtonActive})
    }

    return (
      <span onMouseDown={onMouseDown} style={style}>
        <span>{icon}</span>
      </span>
    )
  }

  render () {
    return (
      <Portal isOpened onOpen={this.props.onFormatMenuOpen}>
        <div style={styles.menuWrapper}>
          <div style={styles.menu}>
            {this.renderBlockButton('paragraph', 'P')}
            {this.renderBlockButton('heading1', 'H1')}
            {this.renderBlockButton('heading2', 'H2')}

            {this.renderMarkButton('bold', 'B')}
            {this.renderMarkButton('italic', 'I')}
            {this.renderMarkButton('code', '</>')}

            {this.renderLinkButton('link', '🔗')}
          </div>
        </div>
      </Portal>
    )
  }
}
