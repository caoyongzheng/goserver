import React from 'react'
import { Connector } from 'react-store-set'
import UserDropMenu from './UserDropMenu'


export default function () {
  return (
    <Connector
      component={UserDropMenu}
      connects={{ Auth: ['role'] }}
      setProps={({ Auth, SignModal }) => ({
        userRole: Auth.state.role,
        onSignIn: SignModal.actions.onSignIn,
        onSignUp: SignModal.actions.onSignUp,
        logout: Auth.actions.logout,
      })}
    />
  )
}
