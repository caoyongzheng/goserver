import React from 'react'
import { Connector } from 'react-appstores'
import DataTable from '../../components/DataTable'

export default function UserTable() {
  return (
    <Connector
      component={DataTable}
      connects={{ UserAdmin: ['users', 'selectedUsers'] }}
      setProps={(states, actions) => ({
        data: states.UserAdmin.users,
        rowKey: 'id',
        cols: [{ title: '用户名', name: 'username' }, { title: '角色', name: 'role' }],
        selectedRows: states.UserAdmin.selectedUsers,
        offset: (states.UserAdmin.page - 1) * states.UserAdmin.pagesize,
        onRowSelection: actions.UserAdmin.onRowSelection,
      })}
    />
  )
}
