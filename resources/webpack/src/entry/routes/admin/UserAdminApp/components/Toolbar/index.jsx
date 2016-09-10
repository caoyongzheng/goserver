import React from 'react'
import { Connector } from 'react-appstores'
import ToolbarView from './ToolbarView'

export default function Toolbar() {
  return (
    <Connector
      component={ToolbarView}
      connects={{ UserAdmin: ['search'] }}
      setProps={(states, actions) => ({
        search: states.UserAdmin.search,
        add: actions.UserAdmin.nHandleOpen,
        del: actions.UserAdmin.handleDOpen,
        refresh: actions.UserAdmin.refresh,
        onSearchChange: actions.UserAdmin.onSearchChange,
        handleSearch: () => actions.UserAdmin.getUserPage(1, states.UserAdmin.pagesize),
      })}
    />
  )
}
