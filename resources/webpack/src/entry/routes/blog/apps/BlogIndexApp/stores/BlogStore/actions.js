import initState from './initState'

function getBlogPage(query) {
  const { dispatch } = this
  $.ajax({
    url: '/api/blog/page',
    data: query,
    success(result) {
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
      }
    },
  })
}
export default { getBlogPage }
