import React from 'react'

import { Link } from 'react-router'
import LoginControl from 'LoginControl'
import { Provider, GlobalStores } from 'react-app-store'
import R from 'R'
import styles, { ACTIVE } from './nav.styles.js'

export default function Nav() {
  return (
    <nav style={styles.nav}>
      <div name="navItems" style={{ overflow: 'auto', display: 'flex' }}>
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
        <Provider
          Component={({ logStatus }) => {
            if (logStatus === 'LOGIN') {
              return (
                <Link to={R.My} activeStyle={ACTIVE} style={styles.link}>
                  My
                </Link>
              )
            }
            return null
          }}
          connects={[
            {
              store: GlobalStores.get('App'),
              propsFn: ({ logStatus }) => ({ logStatus }),
            },
          ]}
        />
      </div>
      <div style={{ flex: 1 }} />
      <Provider
        Component={LoginControl}
        props={{ store: GlobalStores.get('App') }}
        connects={[
          {
            store: GlobalStores.get('App'),
            propsFn: ({ logStatus }) => ({ logStatus }),
            actionsFn: (actions) => ({
              onLogin: actions.onLogin,
              onLogout: actions.onLogout,
              onSignModalDisplay: actions.onSignModalDisplay,
            }),
          },
        ]}
      />
    </nav>
  )
}
