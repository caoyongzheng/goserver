module.exports = {
  path: 'view',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./View'))
    })
  },
}
