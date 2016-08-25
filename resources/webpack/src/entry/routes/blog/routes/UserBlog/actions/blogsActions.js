export default function blogsActions({ dispatch }) {

  function getUserBlogs(userId) {
    if (!userId) {
      $.notify("userId不能为空")
      return
    }
    $.ajax({
      url: `/api/blog/user?userId=${userId}`,
      success(result) {
        const { success, desc, data } = result
        if (success) {
          dispatch({
            type: 'GetUserBlogs',
            state: {
              blogs: data,
            },
          })
          $.notify(desc, 'success')
        } else {
          $.notify(desc)
        }
      },
    })
  }

  return { getUserBlogs }
}
