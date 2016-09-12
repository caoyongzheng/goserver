import React from 'react'
import { Connector } from 'react-store-set'

import DelUserModalView from './DelUserModalView'

function DelUserModal() {
  return (
    <Connector
      component={DelUserModalView}
      connects={{ UserAdmin: ['dUsername', 'comfirmUsername', 'dOpen'] }}
      setProps={({ UserAdmin }) => ({
        open: UserAdmin.state.dOpen,
        username: UserAdmin.state.dUsername,
        comfirmUsername: UserAdmin.state.comfirmUsername,
        handleClose: UserAdmin.actions.handleDClose,
        handleComfirmUsernameChange: UserAdmin.actions.handleComfirmUsernameChange,
        handleSubmit: UserAdmin.actions.delUser,
      })}
    />
  )
}

export default DelUserModal
