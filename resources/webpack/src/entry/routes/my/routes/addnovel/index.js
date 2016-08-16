import R from 'R'

module.exports = {
  path: R.myaddnovel,
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./AddNovel.jsx'))
    })
  },
}
