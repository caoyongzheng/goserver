module.exports = {
  path: 'canvas/2d/icons',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Icons'))
    })
  },
}
