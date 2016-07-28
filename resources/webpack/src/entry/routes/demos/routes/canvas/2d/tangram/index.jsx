module.exports = {
  path: 'canvas/2d/tangram',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Tangram'))
    })
  },
}
