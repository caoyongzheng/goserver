import React, { PropTypes } from 'react'

function Dot({ active, ...others }) {
  const styles = {
    width: '10px',
    height: '10px',
    margin: '0 5px',
    cursor: 'pointer',
    overflow: 'hidden',
    display: 'inline-block',
    borderRadius: '10px',
    backgroundColor: '#fff',
    boxShadow: '0 0 4px #333333',
  }
  if (active) {
    styles.backgroundColor = '#69aaec'
  }
  return (
    <div {...others} style={styles} />
  )
}
Dot.propTypes = {
  active: PropTypes.bool,
}

module.exports = Dot
