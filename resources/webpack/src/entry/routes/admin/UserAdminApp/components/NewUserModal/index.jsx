import React from 'react'
import { Connector } from 'react-appstores'

import NewUserModalView from './NewUserModalView'

function NewUserModal() {
  return (
    <Connector
      component={NewUserModalView}
      connects={{ UserAdmin: ['nOpen', 'nUsername', 'nPassword'] }}
      setProps={(states, actions) => ({
        open: states.UserAdmin.nOpen,
        username: states.UserAdmin.nUsername,
        password: states.UserAdmin.nPassword,
        handleClose: actions.UserAdmin.nHandleClose,
        handleUsernameChange: actions.UserAdmin.handleNUsernameChange,
        handlePasswordChange: actions.UserAdmin.handleNPasswordChange,
        handleSubmit: actions.UserAdmin.handleNSubmit,
      })}
    />
  )
}

export default NewUserModal
