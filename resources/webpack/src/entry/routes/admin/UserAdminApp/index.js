import R from 'R'

module.exports = {
  path: R.AdminUser.pathname,
  onEnter(nextState, replace, next) {
    R.verifyAuth({ page: R.AdminUser, replace, next, nextState })
  },
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./UserAdminApp'))
    })
  },
}
