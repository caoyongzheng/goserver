import React from 'react'
import { Connector } from 'react-store-set'

import NewUserModalView from './NewUserModalView'

function NewUserModal() {
  return (
    <Connector
      component={NewUserModalView}
      connects={{ UserAdmin: ['nOpen', 'nUsername', 'nPassword'] }}
      setProps={({ UserAdmin }) => ({
        open: UserAdmin.state.nOpen,
        username: UserAdmin.state.nUsername,
        password: UserAdmin.state.nPassword,
        handleClose: UserAdmin.actions.nHandleClose,
        handleUsernameChange: UserAdmin.actions.handleNUsernameChange,
        handlePasswordChange: UserAdmin.actions.handleNPasswordChange,
        handleSubmit: UserAdmin.actions.handleNSubmit,
      })}
    />
  )
}

export default NewUserModal
