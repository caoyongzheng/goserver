export default function Actions({ dispatch }) {

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

  return { getBlog }
}
