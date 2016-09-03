import React from 'react'
import BlogForm from '../../../components/BlogForm'
import { Connector } from 'react-appstores'

export default function BlogNewForm() {
  return (
    <Connector
      component={BlogForm}
      connects={{ BlogForm: ['title', 'content'] }}
      setProps={({ BlogForm: { title, content } }) => ({ title, content })}
      setActions={({ BlogForm: { handleTitleChange, handleContentChange, handleNewSubmit } }) =>
      ({ handleTitleChange, handleContentChange, handleSubmit: handleNewSubmit })}
    />
  )
}
