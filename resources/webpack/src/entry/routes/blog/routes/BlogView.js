import R from 'R'

module.exports = {
  path: R.BlogView.pathname,
  onEnter(nextState, replace, next) {
    R.verifyAuth({ page: R.BlogView, replace, next, nextState })
  },
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../apps/BlogViewApp'))
    })
  },
}
