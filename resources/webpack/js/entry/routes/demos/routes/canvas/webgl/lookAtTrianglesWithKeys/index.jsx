module.exports = {
  path: 'canvas/webgl/lookattriangleswithkeys',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./LookAtTrianglesWithKeys'))
    })
  },
}
