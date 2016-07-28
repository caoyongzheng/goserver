import React from 'react'

const styles = {
  timeLine: {
    width: '1px',
    position: 'absolute',
    top: 0,
    left: '60px',
    bottom: 0,
    borderLeft: '2px solid #cfdbe4',
  },
}

function BlogContainer({ children }) {
  return (
    <div name="container">
      <div style={styles.timeLine} />
      <div style={{ position: 'relative' }}>
        {children}
      </div>
    </div>
  )
}
export default BlogContainer
