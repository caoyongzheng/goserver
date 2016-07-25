module.exports = {
  path: 'canvas/webgl/coloredcube',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./ColoredCube.jsx'))
    })
  },
}
