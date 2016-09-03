import initState from './initState'

export default function actionFactory({ dispatch, getState }) {
  function getBlogPage(query) {
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
  return { getBlogPage }
}
