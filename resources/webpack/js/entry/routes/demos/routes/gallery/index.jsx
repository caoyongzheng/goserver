module.exports = {
  path: 'gallery',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Gallery'))
    })
  },
}
