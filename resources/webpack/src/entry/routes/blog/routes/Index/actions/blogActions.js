import { Host } from 'PathUtil'
export default function blogActions({ dispatch }) {
  function getBlogPage(query) {
    $.ajax({
      url: `${Host}/api/blog/page`,
      data: query,
      success: (result) => {
        const { success, total, elements } = result
        if (success) {
          dispatch({
            type: 'GetBlogPage',
            state: {
              page: query.page,
              pagesize: query.pagesize,
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
