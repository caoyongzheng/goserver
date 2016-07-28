module.exports = {
  path: 'canvas/webgl/coloredandtexture',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./ColoredAndTexture.jsx'))
    })
  },
}
