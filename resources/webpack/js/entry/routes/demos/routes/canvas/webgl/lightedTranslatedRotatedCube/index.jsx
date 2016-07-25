module.exports = {
  path: 'canvas/webgl/lightedtranslatedrotatedcube',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./LightedTranslatedRotatedCube'))
    })
  },
}
