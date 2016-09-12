import React from 'react'
import { Connector } from 'react-store-set'
import DelBlogModalView from './DelBlogModal'

export default function () {
  return (
    <Connector
      component={DelBlogModalView}
      connects={{ DelBlogModal: ['open', 'title'] }}
      setProps={({ DelBlogModal }) => ({
        open: DelBlogModal.state.open,
        title: DelBlogModal.state.title,
        handleClose: DelBlogModal.actions.handleClose,
        delBlog: DelBlogModal.actions.delBlog,
      })}
    />
  )
}
