import R from 'R'

module.exports = {
  path: R.BlogEdit.pathname,
  onEnter(nextState, replace, next) {
    R.verifyAuth({ page: R.BlogEdit, replace, next, nextState })
  },
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../apps/BlogEditApp'))
    })
  },
}
