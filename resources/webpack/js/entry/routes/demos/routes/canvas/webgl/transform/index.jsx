module.exports = {
  path: 'canvas/webgl/transform',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Transform.js'))
    })
  },
}
