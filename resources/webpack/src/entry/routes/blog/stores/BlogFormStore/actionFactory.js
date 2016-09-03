import initState from './initState.js'
import R from 'R'

export default function actionFactory({ dispatch, getState }) {
  function getBlog(blogId) {
    $.ajax({
      url: '/api/blog',
      data: { blogId },
      success(result) {
        const { success, data } = result
        if (success) {
          dispatch({
            type: 'GetBlog',
            state: {
              blogId: data.id,
              title: data.title,
              content: data.content,
            }
          })
        }
      },
    })
  }

  function handleTitleChange(title) {
    dispatch({
      type: 'HandleTitleChange',
      state: { title },
    })
  }
  function handleContentChange(content) {
    dispatch({
      type: 'HandleContentChange',
      state: { content },
    })
  }
  function handleEditSubmit() {
    const { blogId, title, content } = getState()
    if (!blogId) {
      $.notify('blog ID shouldn`t be Empty!')
      return
    }
    if (!title) {
      $.notify('blog title shouldn`t be Empty!')
      return
    }
    if (!content) {
      $.notify('blog content shouldn`t be Empty!')
      return
    }
    $.ajax({
      type: 'PUT',
      url: '/api/blog',
      data: { id: blogId, title, content, contentType: 'markdown' },
      success(result) {
        if (result.success) {
          dispatch({
            type: 'HandleEditSubmit',
            state: initState,
          })
          R.BlogView.go({ blogId })
        }
      }
    })
  }

  function handleNewSubmit() {
    const { title, content } = getState()
    if (!title) {
      $.notify('blog title shouldn`t be Empty!')
      return
    }
    if (!content) {
      $.notify('blog content shouldn`t be Empty!')
      return
    }
    $.ajax({
      type: 'POST',
      url: '/api/blog',
      data: { title, content, contentType: 'markdown' },
      success: (result) => {
        if (result.success) {
          dispatch({
            type: 'HandleNewSubmit',
            state: initState,
          })
          R.BlogView.go({ blogId: result.data })
        }
      },
    })
  }

  return { getBlog, handleTitleChange, handleContentChange, handleEditSubmit, handleNewSubmit }
}
