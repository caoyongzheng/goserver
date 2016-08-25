import R from 'R'

module.exports = {
  path: R.BlogEdit,
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Edit'))
    })
  },
}
