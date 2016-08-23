import R from 'R'

module.exports = {
  path: R.BlogView,
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./apps/ViewApp'))
    })
  },
}
