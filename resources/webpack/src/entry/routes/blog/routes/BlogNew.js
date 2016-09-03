import R from 'R'

module.exports = {
  path: R.BlogNew.pathname,
  onEnter(nextState, replace, next) {
    R.verifyAuth({ page: R.BlogNew, replace, next, nextState })
  },
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../apps/BlogNewApp'))
    })
  },
}
