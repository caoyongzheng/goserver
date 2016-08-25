export default function blogActions({ dispatch }) {
  function getBlogPage(page, pagesize) {
    $.ajax({
      url: `/api/blog/page?page=${page}&pagesize=${pagesize}`,
      success: (result) => {
        const { success, total, elements } = result
        if (success) {
          dispatch({
            type: 'GetBlogPage',
            state: {
              page,
              pagesize,
              total,
              blogs: elements,
            },
          })
        } else {
          $.notify(result.desc)
        }
      },
    })
  }
  return { getBlogPage }
}
