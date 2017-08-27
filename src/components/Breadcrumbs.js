import React from 'react'
import map from 'lodash/map'

const styles = {
  list: {
    listStyle: 'none',
    padding: 0
  },

  item: {
    display: 'inline-block'
  },

  separator: {
    margin: '0 0.4em',
    pointerEvents: 'none'
  }
}

export default ({ items }) => (
  <ol style={styles.list}>
    {map(items, ({ path, label }, i) => (
      <li key={path} style={styles.item}>
        {i < items.length - 1 && (
          <span>
            <a href={path}>{label}</a>
            <span style={styles.separator}>›</span>
          </span>
        ) || label}
      </li>
    ))}
  </ol>
)
