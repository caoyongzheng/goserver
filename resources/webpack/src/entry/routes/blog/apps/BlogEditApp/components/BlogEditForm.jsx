import React from 'react'
import { Connector } from 'react-store-set'
import BlogEditFormView from '../../../components/BlogForm'

export default function BlogEditForm() {
  return (
    <Connector
      component={BlogEditFormView}
      connects={{ BlogForm: ['title', 'content'] }}
      setProps={({ BlogForm }) => ({
        title: BlogForm.state.title,
        content: BlogForm.state.content,
        handleTitleChange: BlogForm.actions.handleTitleChange,
        handleContentChange: BlogForm.actions.handleContentChange,
        handleSubmit: BlogForm.actions.handleEditSubmit,
      })}
    />
  )
}
