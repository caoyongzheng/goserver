module.exports = {
  path: 'demos',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Demo.jsx'))
    })
  },
  childRoutes: [
    require('./routes/canvas/2d/countdown/index.jsx'),
    require('./routes/canvas/2d/icons/index.jsx'),
    require('./routes/canvas/2d/tangram/index.jsx'),
    require('./routes/canvas/2d/gallery/index.jsx'),

    require('./routes/canvas/webgl/point/index.jsx'),
    require('./routes/canvas/webgl/baseShapes/index.jsx'),
    require('./routes/canvas/webgl/transform/index.jsx'),
    require('./routes/canvas/webgl/coloredAndTexture/index.jsx'),
    require('./routes/canvas/webgl/lookAtTriangles/index.jsx'),
    require('./routes/canvas/webgl/lookAtTrianglesWithKeys/index.jsx'),
    require('./routes/canvas/webgl/orthoView/index.jsx'),
    require('./routes/canvas/webgl/perspectiveView/index.jsx'),
    require('./routes/canvas/webgl/helloCube/index.jsx'),
    require('./routes/canvas/webgl/coloredCube/index.jsx'),
    require('./routes/canvas/webgl/lightedCube/index.jsx'),
    require('./routes/canvas/webgl/lightedTranslatedRotatedCube/index.jsx'),

    require('./routes/css3/carousel/index.jsx'),

    require('./routes/gallery/index.jsx'),
    require('./routes/paging/index.jsx'),
    require('./routes/chat/index.jsx'),
    require('./routes/popupview/index.jsx'),
    require('./routes/wysiwyg/index.jsx'),
  ],
}
