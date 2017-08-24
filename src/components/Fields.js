import React from 'react'
import map from 'lodash/map'
import filter from 'lodash/filter'

export default ({ path = '', fields, value, onChange }) => (
  map(fields, ({ components, props, ...fields }, key) => {
    const Component = components.field || components.default
    const label = props && props.label || key

    return (
      <Component
        {...props}
        path={filter([path, key]).join('.')}
        key={key}
        label={label || key}
        value={value[key]}
        onChange={changed => onChange({
          ...value,
          [key]: changed
        })}
      />
    )
  })
)
