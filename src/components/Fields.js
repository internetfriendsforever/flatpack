import React from 'react'
import { map } from 'lodash'

export default ({ fields, value, onChange }) => (
  map(fields, ({ Component, label, ...props }, key) => (
    <Component
      {...props}
      key={key}
      label={label || key}
      value={value[key]}
      onChange={changed => onChange({
        ...value,
        [key]: changed
      })}
    />
  ))
)
