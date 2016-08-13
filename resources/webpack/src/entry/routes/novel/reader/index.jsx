module.exports = {
  path: 'novelreader',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./NovelReader'))
    })
  },
  childRoutes: [
    require('./routes/viewer/index'),
    require('./routes/catalog/index'),
  ],
}
