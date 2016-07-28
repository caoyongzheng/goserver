module.exports = {
  path: 'canvas/webgl/lookattriangles',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./LookAtTriangles'))
    })
  },
}
