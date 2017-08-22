import React from 'react'

const styles = {
  button: {
    display: 'block',
    fontSize: 'inherit',
    lineHeight: '1.4em',
    width: '100%',
    boxSizing: 'border-box',
    padding: '0.75em',
    border: 0,
    background: '#333',
    fontWeight: 'bold',
    color: 'white',
    cursor: 'pointer'
  },

  primary: {
    background: 'rgb(36, 178, 161)'
  },

  disabled: {
    pointerEvents: 'none',
    background: '#ccc'
  },

  loading: {
    cursor: 'wait',
    background: '#ccc'
  }
}

export default props => {
  const passProps = {
    ...props,
    style: {
      ...styles.button,
      ...(props.primary && styles.primary),
      ...(props.disabled && styles.disabled),
      ...(props.loading && styles.loading)
    }
  }

  if (props.loading) {
    passProps.disabled = true
  }

  delete passProps.primary
  delete passProps.submit
  delete passProps.loading

  if (props.submit) {
    delete passProps.children

    return React.createElement('input', {
      ...passProps,
      type: 'submit',
      value: props.children
    })
  }

  return React.createElement('button', passProps)
}
