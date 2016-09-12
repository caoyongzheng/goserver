import React from 'react'
import { Connector } from 'react-store-set'
import DataTable from '../../components/DataTable'

export default function UserTable() {
  return (
    <Connector
      component={DataTable}
      connects={{ UserAdmin: ['users', 'selectedUsers'] }}
      setProps={({ UserAdmin }) => ({
        rowKey: 'id',
        cols: [{ title: '用户名', name: 'username' }, { title: '角色', name: 'role' }],
        data: UserAdmin.state.users,
        selectedRows: UserAdmin.state.selectedUsers,
        offset: (UserAdmin.state.page - 1) * UserAdmin.state.pagesize,
        onRowSelection: UserAdmin.actions.onRowSelection,
      })}
    />
  )
}
