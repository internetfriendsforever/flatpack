import React from 'react'
import styled from 'styled-components'
import EntypoChevronThinRight from 'react-entypo/lib/entypo/ChevronThinRight'
import map from 'lodash/map'
import Link from '../ui/Link'

const List = styled.ol`
  list-style: none;
  padding: 0;
`

const Item = styled.li`
  display: inline-block;
`

const Separator = styled.span`
  vertical-align: middle;
  margin: 0 0.25em;

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
              <EntypoChevronThinRight />
            </Separator>
          </span>
        ) || label}
      </Item>
    ))}
  </List>
)
