import React, { PropTypes } from 'react'

import _ from 'lodash'
import styles from './input.style.js'

function Input({ value, onChange, style, ...other }) {
  const styleArr = _.merge({}, styles.normal)
  if (style) {
    _.merge(styleArr, style)
  }
  return (
    <input value={value} onChange={onChange} style={styleArr} {...other} />
  )
}
Input.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  style: PropTypes.object,
}
export default Input
