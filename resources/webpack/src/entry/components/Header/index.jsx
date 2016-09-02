import React from 'react'
import { Connector } from 'react-appstores'
import Header from './Header'

export default function () {
  return (
    <Connector
      component={Header}
      connects={{ Auth: ['username', 'headerIcon'], Page: ['page'] }}
      setProps={({ Auth: { username, headerIcon }, Page: { page } }) =>
      ({ username, headerIcon, page })}
      setActions={({ LeftNav: { handleOpen } }) => ({
        onLeftIconButtonTouchTap: handleOpen,
      })}
    />
  )
}
