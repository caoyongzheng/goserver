export default function Actions({ dispatch, getState }) {

  function getBlog(blogId) {
    $.ajax({
      url: `/api/blog?blogId=${blogId}`,
      success: (result) => {
        const { success, desc, data } = result
        if (success) {
          dispatch({
            type: 'GetBlog',
            state: { blog: data },
          })
        }
      },
    })
  }

  function delBlog() {
    const blogId = getState().blog.id
    $.ajax({
      type: 'DELETE',
      url: `/api/blog?blogId=${blogId}`,
      success: (result) => {
        const { success, desc } = result
        if (success) {
          history.go(-1)
        } else {
          $.notify(desc)
        }
      },
    })
  }

  function delBlogPopupShow() {
    dispatch({
      type: 'DelBlogPopupShow',
      state: { delBlogPopupShow: true, confirmTitle: '' },
    })
  }

  function delBlogPopupClose() {
    dispatch({
      type: 'DelBlogPopupClose',
      state: { delBlogPopupShow: false },
    })
  }

  function onConfirmTitle(confirmTitle) {
    dispatch({
      type: 'OnConfirmTitle',
      state: { confirmTitle },
    })
  }

  return { getBlog, delBlogPopupShow, delBlogPopupClose, delBlog, onConfirmTitle }
}
