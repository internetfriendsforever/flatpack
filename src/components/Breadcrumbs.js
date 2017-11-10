import React from 'react'
import styled from 'styled-components'
import EntypoChevronSmallRight from 'react-entypo/lib/entypo/ChevronSmallRight'
import map from 'lodash/map'
import Link from '../ui/Link'

const List = styled.ol`
  list-style: none;
  padding: 0;
  margin: 1em 0.5em;
`

const Item = styled.li`
  display: inline-block;
`

const Separator = styled.span`
  vertical-align: middle;
  margin: 0 0.15em;

  & svg path {
    fill: rgba(0, 0, 0, 0.4);
  }
`

export default ({ items }) => (
  <List>
    {map(items, ({ path, label }, i) => (
      <Item key={path}>
        {i < items.length - 1 && (
          <span>
            <Link href={path}>
              {label}
            </Link>

            <Separator>
              <EntypoChevronSmallRight />
            </Separator>
          </span>
        ) || label}
      </Item>
    ))}
  </List>
)
