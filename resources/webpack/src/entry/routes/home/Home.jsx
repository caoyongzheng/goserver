import React from 'react'

import Nav from 'Nav'
import LayoutStyle from 'LayoutStyle'

function Home() {
  return (
    <div name="home" style={LayoutStyle.stageCol}>
      <Nav />
      <div name="body" style={LayoutStyle.body}>
        <h1>{'this is the home page'}</h1>
      </div>
    </div>
  )
}
module.exports = Home
