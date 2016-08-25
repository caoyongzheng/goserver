import R from 'R'

module.exports = {
  path: R.BlogUserBlog,
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./apps/UserBlogApp'))
    })
  },
}
