module.exports = {
  path: 'popup',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./PopupView'))
    })
  },
}
