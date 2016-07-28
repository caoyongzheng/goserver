module.exports = {
  path: 'canvas/webgl/baseshapes',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./BaseShapes.jsx'))
    })
  },
}
