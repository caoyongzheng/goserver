import React from 'react'

import { Link } from 'react-router'

import LoginControl from 'LoginControl'

import styles, { ACTIVE } from './nav.styles.js'

function Nav() {
  return (
    <nav style={styles.nav}>
      <Link to="/home" activeStyle={ACTIVE} style={styles.link}>
        home
      </Link>
      <Link to="/demos" activeStyle={ACTIVE} style={styles.link}>
        demo
      </Link>
      <Link to="/video/view" activeStyle={ACTIVE} style={styles.link}>
        video
      </Link>
      <Link to="/blog" activeStyle={ACTIVE} style={styles.link}>
        blog
      </Link>
      <LoginControl style={{ float: 'right' }} />
    </nav>
  )
}

export default Nav
