import React from 'react'
import { Connector } from 'react-appstores'
import UserDropMenu from './UserDropMenu'


export default function () {
  return (
    <Connector
      component={UserDropMenu}
      setProps={({ Auth: { role } }) => ({ userRole: role })}
      setActions={({ SignModal: { onSignIn, onSignUp }, Auth: { logout } }) =>
      ({ onSignIn, onSignUp, logout })}
      connects={{ Auth: ['role'] }}
    />
  )
}
