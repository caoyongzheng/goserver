import R from 'R'

module.exports = {
  path: R.BlogNew,
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./New'))
    })
  },
}
