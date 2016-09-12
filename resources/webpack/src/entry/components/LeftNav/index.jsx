import React from 'react'
import { Connector } from 'react-store-set'
import LeftNavView from './LeftNav'
import R from 'R'

export default function () {
  return (
    <Connector
      component={LeftNavView}
      connects={{ LeftNav: ['open'], RouterStore: ['location'], Auth: ['role'] }}
      setProps={({ RouterStore, LeftNav, Auth }) => ({
        page: R.getPage(RouterStore.state.location.pathname),
        open: LeftNav.state.open,
        role: Auth.state.role,
        handleClose: LeftNav.actions.handleClose,
      })}
    />
  )
}
