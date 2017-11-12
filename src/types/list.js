import React from 'react'
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc'
import EntypoMenu from 'react-entypo/lib/entypo/Menu'
import Root from '../ui/Root'
import Box from '../ui/Box'
import PathLink from '../components/PathLink'
import PathBreadcrumbs from '../components/PathBreadcrumbs'
import createType from './createType'
import group from './group'

const Group = group().components.Edit

const initialValue = []

const styles = {
  item: {
    display: 'flex'
  },

  handle: {
    flex: '0 0 auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0 0.25em',
    cursor: 'move'
  },

  icon: {
    flex: 'auto'
  },

  label: {
    flex: 1,
    display: 'block',
    padding: '0.5em'
  }
}

const Item = SortableElement(({ path, label }) =>
  <Root>
    <div style={styles.item}>
      <Handle />
      <PathLink path={path}>
        <span style={styles.label}>
          {label}
        </span>
      </PathLink>
    </div>
  </Root>
)

const Handle = SortableHandle(({ path, label }) =>
  <div style={styles.handle}>
    <EntypoMenu style={styles.icon} />
  </div>
)

const List = SortableContainer(({ items }) => {
  return (
    <div>
      {items.map((value, index) => (
        <Item key={index} index={index} {...value} />
      ))}
    </div>
  )
})

const Edit = ({ segments, resolved, value = initialValue, onChange, display, fields, label, itemLabel }) => {
  if (segments.length > resolved.length) {
    const key = segments[resolved.length]
    const item = value[key]
    const index = parseInt(key, 10)
    const label = itemLabel ? itemLabel(item) : `Item ${key}`

    resolved.push(label)

    return (
      <div>
        <Group
          segments={segments}
          resolved={resolved}
          fields={fields}
          value={item}
          onChange={modified => {
            const nextValue = [...value]
            nextValue[index] = modified
            onChange(nextValue)
          }}
        />

        {segments.length === resolved.length && (
          <button onClick={() => console.log('Remove')}>Remove</button>
        )}
      </div>
    )
  }

  return (
    <div>
      <PathBreadcrumbs segments={segments} resolved={resolved} />

      <Box title={label || 'List'}>
        <button onClick={() => {
          onChange([ ...value, {} ])
        }}>
          Add
        </button>

        <List useDragHandle items={value.map((item, i) => ({
          path: [...segments, i].join('/'),
          label: itemLabel ? itemLabel(item) : `Item`
        }))} onSortEnd={({ oldIndex, newIndex }) => {
          onChange(arrayMove(value, oldIndex, newIndex))
        }} />
      </Box>
    </div>
  )
}

const Field = ({ path, segments, value = initialValue, onChange, fields, label }) => {
  return (
    <PathLink path={[...segments, path].join('/')}>
      <Box>
        {label || 'List'}
      </Box>
    </PathLink>
  )
}

export default createType({ Edit, Field })
