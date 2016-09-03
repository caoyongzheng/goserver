import React from 'react'
import { Connector } from 'react-appstores'
import Header from './Header'

export default function () {
  return (
    <Connector
      component={Header}
      connects={{ Auth: ['username', 'headerIcon'], Page: ['page'] }}
      setProps={(states, actions) => ({
        username: states.Auth.username,
        headerIcon: states.Auth.headerIcon,
        page: states.Page.page,
        onLeftIconButtonTouchTap: actions.LeftNav.handleToggle,
        onTitleTouchTap: actions.LeftNav.handleToggle,
      })}
    />
  )
}
