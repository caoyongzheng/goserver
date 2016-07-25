import React from 'react'

import Nav from 'Nav'
import LayoutStyle from 'LayoutStyle'

function Video({ children }) {
  return (
    <div style={LayoutStyle.stageCol}>
      <Nav />
      <div name="body" style={LayoutStyle.body}>
        {children}
      </div>
    </div>
  )
}

module.exports = Video
