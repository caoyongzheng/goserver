import React from 'react'
import { Connector } from 'react-store-set'
import Header from './Header'
import R from 'R'

export default function () {
  return (
    <Connector
      component={Header}
      connects={{ Auth: ['username', 'headerIcon'], RouterStore: ['location'] }}
      setProps={({ Auth, RouterStore, LeftNav }) => ({
        username: Auth.state.username,
        headerIcon: Auth.state.headerIcon,
        page: R.getPage(RouterStore.state.location.pathname),
        onLeftIconButtonTouchTap: LeftNav.actions.handleToggle,
        onTitleTouchTap: LeftNav.actions.handleToggle,
      })}
    />
  )
}
