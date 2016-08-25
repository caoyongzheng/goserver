import React, { PropTypes } from 'react'
import _ from 'lodash'

function SvgIcon({ transform, paths, ...others }) {
  return (
    <svg {...others}>
      <g transform={transform}>
        {_.map(paths, (p, i) => (
          <path key={i} d={p} />
        ))}
      </g>
    </svg>
  )
}

SvgIcon.propTypes = {
  transform: PropTypes.string,
  paths: PropTypes.arrayOf(PropTypes.string).isRequired,
}
export default SvgIcon
