import React from 'react'

const styles = {
  normal: {
    background: '#E4FCFA',
    borderRadius: 2,
    lineHeight: 1.4,
    padding: '0.75em',
    margin: '1em 0'
  },

  warn: {
    background: '#FCEDE4'
  },

  critical: {
    background: '#FFD5D5'
  }
}

export default ({ children, warn, critical }) => (
  <div style={{
    ...styles.normal,
    ...(warn && styles.warn),
    ...(critical && styles.critical)
  }}>
    {children}
  </div>
)
