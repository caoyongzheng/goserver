import initState from './initState'

function handleClose() {
  const { dispatch } = this
  dispatch({
    type: 'HandleClose',
    state: { open: false },
  })
}

function onDelBlog(blogId) {
  const { dispatch } = this
  $.ajax({
    url: '/api/blog/title',
    data: { blogId },
    success(result) {
      const { success, data } = result
      if (success) {
        dispatch({
          type: 'onDelBlog',
          state: {
            open: true,
            blogId,
            title: data,
          }
        })
      }
    }
  })
}

function delBlog() {
  const { dispatch, getState } = this
  const { blogId } = getState()
  if (blogId) {
    $.ajax({
      type: 'DELETE',
      url: `/api/blog?blogId=${blogId}`,
      success: (result) => {
        const { success, desc } = result
        console.log(result)
        if (success) {
          dispatch({
            type: 'DelBlog',
            state: {...initState},
          })
        }
      },
    })
  }
}

export default { handleClose, onDelBlog, delBlog }
