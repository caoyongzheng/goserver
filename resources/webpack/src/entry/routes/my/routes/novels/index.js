import R from 'R'

module.exports = {
  path: R.mynovels,
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Novels.jsx'))
    })
  },
}
