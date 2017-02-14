import React from 'react'
import Portal from 'react-portal'

const styles = {
  menuWrapper: {
    zIndex: 5,
    position: 'absolute'
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
  }
}

export default class FormatMenu extends React.Component {
  static propTypes = {
    onClickMarkButton: React.PropTypes.func.isRequired,
    onFormatMenuOpen: React.PropTypes.func.isRequired,
    hasMark: React.PropTypes.func.isRequired
  }

  renderMarkButton = (type, icon) => {
    const isActive = this.props.hasMark(type)
    const onMouseDown = e => this.props.onClickMarkButton(e, type)

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

  render () {
    return (
      <Portal isOpened onOpen={this.props.onFormatMenuOpen}>
        <div style={styles.menuWrapper}>
          <div style={styles.menu}>
            {this.renderMarkButton('bold', 'B')}
            {this.renderMarkButton('italic', 'I')}
            {this.renderMarkButton('code', '</>')}
          </div>
        </div>
      </Portal>
    )
  }
}
