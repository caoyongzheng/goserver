import _ from 'lodash'

export default function delBlogPopupActions({ dispatch, getState }) {
  function delBlogPopupShow(blogId) {
    const delBlog = _.find(getState().blogs, (b) => (b.id === blogId))
    if (_.isEmpty(delBlog)) {
      $.notify(`can not find blog with ${blogId}`)
      return
    }
    dispatch({
      type: 'DelBlogPopupShow',
      state : {
        delBlog,
        confirmTitle: '',
        delBlogPopupShow: true,
      },
    })
  }

  function delBlogPopupClose() {
    dispatch({
      type: 'DelBlogPopupClose',
      state: {
        delBlog: {},
        confirmTitle: '',
        delBlogPopupShow: false,
      },
    })
  }

  function onConfirmTitle(confirmTitle) {
    dispatch({
      type: 'OnConfirmTitle',
      state: {
        confirmTitle,
      },
    })
  }

  function delBlog() {
    const blogId = getState().delBlog._id
    if (!blogId) {
      $.notify('falid to delete blog, con not find blogId')
      return
    }
    $.ajax({
      type: 'DELETE',
      url: `/api/blog?blogId=${blogId}`,
      success: (result) => {
        const { success, desc } = result
        if (success) {
          dispatch({
            type: 'DelBlog',
            state: {
              delBlog: {},
              confirmTitle: '',
              delBlogPopupShow: false,
            }
          })
          $.notify(desc, 'success')
        } else {
          $.notify(desc)
        }
      },
    })
  }
  return { delBlogPopupShow, delBlogPopupClose, onConfirmTitle, delBlog }
}
