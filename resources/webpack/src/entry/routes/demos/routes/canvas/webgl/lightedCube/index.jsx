module.exports = {
  path: 'canvas/webgl/lightedcube',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./LightedCube.jsx'))
    })
  },
}
