import React, { PropTypes } from 'react'

import { Link } from 'react-router'
import LoginControl from 'LoginControl'
import { Provider, GlobalStores } from 'react-app-store'
import R from 'R'
import styles, { ACTIVE } from './nav.styles.js'

function Nav({ loginState }) {
  return (
    <nav style={styles.nav}>
      <Link to={R.home} activeStyle={ACTIVE} style={styles.link}>
        home
      </Link>
      <Link to={R.demos} activeStyle={ACTIVE} style={styles.link}>
        demo
      </Link>
      <Link to={R.videoView} activeStyle={ACTIVE} style={styles.link}>
        video
      </Link>
      <Link to={R.blog} activeStyle={ACTIVE} style={styles.link}>
        blog
      </Link>
      {
        loginState === GlobalStores.get('App').getData().loginStates.LOGIN ?
        (
          <Link to={R.My} activeStyle={ACTIVE} style={styles.link}>
            My
          </Link>
        ) : null
      }

      <Provider
        Component={LoginControl}
        props={{ style: { float: 'right' }, store: GlobalStores.get('App') }}
        connects={[
          {
            store: GlobalStores.get('App'),
            propsFn: (state) => ({ user: state.user, loginState: state.loginState }),
            actionsFn: (actions) => ({ login: actions.login, logout: actions.logout }),
          },
        ]}
      />
    </nav>
  )
}

Nav.propTypes = {
  loginState: PropTypes.string.isRequired,
}

export default () => (
  <Provider
    Component={Nav}
    connects={[
      {
        store: GlobalStores.get('App'),
        propsFn: (state) => ({ loginState: state.loginState }),
      },
    ]}
  />
)
