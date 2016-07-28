module.exports = {
  path: 'canvas/webgl/point',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Point.js'))
    })
  },
}
