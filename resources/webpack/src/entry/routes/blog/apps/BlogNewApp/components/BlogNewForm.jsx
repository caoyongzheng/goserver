import React from 'react'
import { Connector } from 'react-store-set'
import BlogFormView from '../../../components/BlogForm'

export default function BlogNewForm() {
  return (
    <Connector
      component={BlogFormView}
      connects={{ BlogForm: ['title', 'content'] }}
      setProps={({ BlogForm }) => ({
        title: BlogForm.state.title,
        content: BlogForm.state.content,
        handleTitleChange: BlogForm.actions.handleTitleChange,
        handleContentChange: BlogForm.actions.handleContentChange,
        handleSubmit: BlogForm.actions.handleNewSubmit,
      })}
    />
  )
}
