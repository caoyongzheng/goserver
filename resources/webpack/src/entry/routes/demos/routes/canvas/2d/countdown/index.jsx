module.exports = {
  path: 'canvas/2d/countdown',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Countdown'))
    })
  },
}
