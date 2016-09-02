import React from 'react'
import { Connector } from 'react-appstores'
import SignModal from './SignModal'

export default function () {
  return (
    <Connector
      component={SignModal}
      setProps={({ SignModal: { type, open } }) => (
        { type, open }
      )}
      setActions={({ SignModal: { cancel, submitSignIn, submitSignUp }, Auth: { login } }) => ({
        cancel,
        submitSignIn: (data) => submitSignIn(data, login),
        submitSignUp: (data) => submitSignUp(data, login),
      })}
      connects={{ SignModal: ['type', 'open'] }}
    />
  )
}
