module.exports = {
  path: 'canvas/2d/gallery',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Gallery'))
    })
  },
}
