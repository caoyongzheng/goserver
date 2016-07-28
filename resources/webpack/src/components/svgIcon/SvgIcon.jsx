import React, { PropTypes } from 'react'

class SvgIcon extends React.Component {
  getTransform = (position, direction, size, realIconSize) => {
    const scaleW = size[0] / realIconSize[0]
    const scaleH = size[1] / realIconSize[1]
    return `translate(${position.join(', ')})
    scale(${direction.join(', ')} ) scale(${scaleW},${scaleH})`
  }
  render() {
    const { paths, size, position, direction, realIconSize,
      style, className, onClick } = this.props
    return (
      <svg
        style={style}
        className={className}
        width={size[0]}
        height={size[1]}
        onClick={onClick}
      >
        <g transform={this.getTransform(position, direction, size, realIconSize)}>
          {paths.map((path, i) => <path key={i} d={path} />)}
        </g>
      </svg>
    )
  }
}
SvgIcon.defaultProps = {
  size: [16, 16],
  position: [0, 0],
  direction: [1, 1],
  realIconSize: [1024, 1024],
}
SvgIcon.propTypes = {
  onClick: PropTypes.func,
  paths: PropTypes.arrayOf(PropTypes.string).isRequired,
  size: PropTypes.arrayOf(PropTypes.number),
  position: PropTypes.arrayOf(PropTypes.number),
  direction: PropTypes.arrayOf(PropTypes.number),
  realIconSize: PropTypes.arrayOf(PropTypes.number),
}
export default SvgIcon
