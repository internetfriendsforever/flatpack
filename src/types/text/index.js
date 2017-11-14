import React from 'react'
import Rich from './Rich'
import Plain from './Plain'
import createType from '../createType'

const Edit = ({ rich = false, ...props }) => (
  rich ? (
    <Rich {...props} />
  ) : (
    <Plain {...props} />
  )
)

export default createType({ Edit })
