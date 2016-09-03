import R from 'R'

module.exports = {
  path: R.BlogIndex.pathname,
  onEnter(nextState, replace, next) {
    R.verifyAuth({ page: R.BlogIndex, replace, next, nextState })
  },
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../apps/BlogIndexApp'))
    })
  },
}
