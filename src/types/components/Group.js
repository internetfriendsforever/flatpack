import React from 'react'
import map from 'lodash/map'
import Box from '../../ui/Box'
import PathLink from '../../components/PathLink'
import PathBreadcrumbs from '../../components/PathBreadcrumbs'

const initialValue = {}

export default ({ segments, resolved, value = initialValue, onChange, fields, label }) => {
  if (segments.length > resolved.length) {
    const key = segments[resolved.length]
    const field = fields[key]
    const { components, props } = field
    const Component = components.default
    const label = field.props.label || key

    return (
      <Component
        {...props}
        segments={segments}
        resolved={[ ...resolved, label ]}
        fields={field}
        value={value[key]}
        onChange={changed => onChange({
          ...value,
          [key]: changed
        })}
      />
    )
  }

  return (

    <div>
      <PathBreadcrumbs segments={segments} resolved={resolved} />

      {map(fields, ({ components, props, ...fields }, key) => {
        const Component = components.field || components.default
        const label = props && props.label || key

        return (
          <Component
            {...props}
            key={key}
            path={key}
            segments={segments}
            resolved={resolved}
            label={label || key}
            value={value[key]}
            onChange={changed => onChange({
              ...value,
              [key]: changed
            })}
          />
        )
      })}
    </div>
  )
}

export const field = ({ path, segments, value = initialValue, onChange, fields, label }) => {
  return (
    <PathLink path={[...segments, path].join('/')}>
      <Box>
        <div>{label || 'Group'}</div>
      </Box>
    </PathLink>
  )
}
