import React from 'react'
import { Connector } from 'react-store-set'
import SignModalView from './SignModal'

export default function () {
  return (
    <Connector
      component={SignModalView}
      connects={{ SignModal: ['type', 'open'] }}
      setProps={({ SignModal, Auth }) => ({
        type: SignModal.state.type,
        open: SignModal.state.open,
        cancel: SignModal.actions.cancel,
        submitSignIn: (data) => SignModal.actions.submitSignIn(data, Auth.actions.login),
        submitSignUp: (data) => SignModal.actions.submitSignUp(data, Auth.actions.login),
      })}
    />
  )
}
