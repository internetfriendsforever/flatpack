import React from 'react'
import styled, { css } from 'styled-components'

const Menu = styled.div`
  display: flex;
  background: white;
  margin: 10px 0;
  border: 1px #eee solid;
`

const Button = styled.button`
  font: inherit;
  border: 0;
  padding: 0;
  width: 32px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  background: white;
  color: #aaa;
  font-size: 0.8em;

  &:hover {
    color: black;
  }

  ${props => props.active && css`
    color: black;
  `}
`

export default class FormatMenu extends React.Component {
  renderMarkButton = (type, icon) => {
    const isActive = this.props.hasMark(type)
    const onMouseDown = e => this.props.onMarkButtonClick(e, type)

    return (
      <Button onMouseDown={onMouseDown} active={isActive}>
        {icon}
      </Button>
    )
  }

  renderBlockButton = (type, icon, child = null) => {
    const isActive = this.props.hasBlock(type)
    const onMouseDown = e => this.props.onBlockButtonClick(e, type)

    return (
      <Button onMouseDown={onMouseDown} active={isActive}>
        <span>{icon}</span>
      </Button>
    )
  }

  render () {
    return (
      <Menu>
        {this.renderBlockButton('paragraph', 'P')}
        {this.renderBlockButton('heading-1', 'H1')}
        {this.renderBlockButton('heading-2', 'H2')}
        {this.renderBlockButton('bullet-list', 'ul', 'list-item')}
        {this.renderBlockButton('number-list', 'ol', 'list-item')}
        {this.renderMarkButton('bold', 'B')}
        {this.renderMarkButton('italic', 'I')}
      </Menu>
    )
  }
}
