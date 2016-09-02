import React from 'react'
import { Connector } from 'react-appstores'
import LeftNav from './LeftNav'

export default function () {
  return (
    <Connector
      component={LeftNav}
      connects={{ Page: ['page'], LeftNav: ['open'], Auth: ['role'] }}
      setProps={({ Page: { page }, LeftNav: { open }, Auth: { role } }) => ({
        page, open, role,
      })}
      setActions={({ LeftNav: { handleClose } }) => ({
        handleClose,
      })}
    />
  )
}
