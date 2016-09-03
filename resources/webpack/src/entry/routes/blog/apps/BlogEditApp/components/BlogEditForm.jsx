import React from 'react'
import BlogForm from '../../../components/BlogForm'
import { Connector } from 'react-appstores'

export default function BlogEditForm() {
  return (
    <Connector
      component={BlogForm}
      connects={{ BlogForm: ['title', 'content'] }}
      setProps={({ BlogForm: { title, content } }) => ({ title, content })}
      setActions={({ BlogForm: { handleTitleChange, handleContentChange, handleEditSubmit } }) =>
      ({ handleTitleChange, handleContentChange, handleSubmit: handleEditSubmit })}
    />
  )
}
