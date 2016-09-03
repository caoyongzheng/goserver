import React from 'react'
import DelBlogModal from './DelBlogModal'
import { Connector } from 'react-appstores'

export default function () {
  return (
    <Connector
      component={DelBlogModal}
      connects={{ DelBlogModal: ['open', 'title'] }}
      setProps={({ DelBlogModal: { open, title } }) => ({
        open, title,
      })}
      setActions={({ DelBlogModal: { handleClose, delBlog } }) => ({
        handleClose, delBlog,
      })}
    />
  )
}
