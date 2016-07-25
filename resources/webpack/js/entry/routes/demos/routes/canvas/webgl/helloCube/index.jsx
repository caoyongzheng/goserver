module.exports = {
  path: 'canvas/webgl/hellocube',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./HelloCube.js'))
    })
  },
}
