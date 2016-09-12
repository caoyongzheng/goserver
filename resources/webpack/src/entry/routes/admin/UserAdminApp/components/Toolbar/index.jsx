import React from 'react'
import { Connector } from 'react-store-set'
import ToolbarView from './ToolbarView'

export default function Toolbar() {
  return (
    <Connector
      component={ToolbarView}
      connects={{ UserAdmin: ['search'] }}
      setProps={({ UserAdmin }) => ({
        search: UserAdmin.state.search,
        add: UserAdmin.actions.nHandleOpen,
        del: UserAdmin.actions.handleDOpen,
        refresh: UserAdmin.actions.refresh,
        onSearchChange: UserAdmin.actions.onSearchChange,
        handleSearch: () => UserAdmin.actions.getUserPage(1, UserAdmin.state.pagesize),
      })}
    />
  )
}
