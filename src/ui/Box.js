import React from 'react'

const styles = {
  box: {
    position: 'relative',
    display: 'block',
    border: '1px solid rgba(0, 0, 0, 0.15)',
    padding: '0.5em 0.75em',
    margin: '1em 0',
    background: 'white',
    borderRadius: 2
  },

  title: {
    fontSize: '0.75em',
    fontWeight: 'normal',
    margin: '0.3em 0 0 0',
    textTransform: 'uppercase',
    letterSpacing: '0.082em',
    color: '#888'
  },

  disabled: {
    opacity: 0.4
  }
}

export default ({ title, disabled, children }) => (
  <div style={{
    ...styles.box,
    ...(disabled && styles.disabled)
  }}>
    {title && (
      <div style={styles.title}>
        {title}
      </div>
    )}

    {children}
  </div>
)
