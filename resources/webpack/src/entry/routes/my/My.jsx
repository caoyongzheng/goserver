import React from 'react'
import _ from 'lodash'
import Nav from 'Nav'
import LayoutStyle from 'LayoutStyle'
import LeftNav from './components/LeftNav.jsx'

const My = ({ children }) => (
  <div name="my" style={LayoutStyle.stageCol}>
    <Nav />
    <div name="body" style={_.merge({}, LayoutStyle.body, { display: 'flex' })}>
      <div name={"left"}>
        <LeftNav />
      </div>
      <div name={"right"} style={{ flex: 1 }}>
        {children}
      </div>
    </div>
  </div>
)

module.exports = My
