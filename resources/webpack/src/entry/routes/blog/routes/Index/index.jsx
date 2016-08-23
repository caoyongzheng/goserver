import R from 'R'
module.exports = {
  path: R.BlogIndex,
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./apps/Index'))
    })
  },
}