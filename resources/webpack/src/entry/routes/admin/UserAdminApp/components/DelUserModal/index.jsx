import React from 'react'
import { Connector } from 'react-appstores'

import DelUserModalView from './DelUserModalView'

function DelUserModal() {
  return (
    <Connector
      component={DelUserModalView}
      connects={{ UserAdmin: ['dUsername', 'comfirmUsername', 'dOpen'] }}
      setProps={(states, actions) => ({
        open: states.UserAdmin.dOpen,
        username: states.UserAdmin.dUsername,
        comfirmUsername: states.UserAdmin.comfirmUsername,
        handleClose: actions.UserAdmin.handleDClose,
        handleComfirmUsernameChange: actions.UserAdmin.handleComfirmUsernameChange,
        handleSubmit: actions.UserAdmin.delUser,
      })}
    />
  )
}

export default DelUserModal
