module.exports = {
  path: 'canvas/webgl/perspectiveview',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./PerspectiveView'))
    })
  },
}
