import initState from './initState'

export default function actionFactory({ dispatch, getState }) {
  function handleClose() {
    dispatch({
      type: 'HandleClose',
      state: { open: false },
    })
  }

  function onDelBlog(blogId) {
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
              state: initState,
            })
          }
        },
      })
    }
  }

  return { handleClose, onDelBlog, delBlog }
}
