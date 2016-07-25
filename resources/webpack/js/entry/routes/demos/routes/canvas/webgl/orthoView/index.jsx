module.exports = {
  path: 'canvas/webgl/orthoview',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./OrthoView'))
    })
  },
}
