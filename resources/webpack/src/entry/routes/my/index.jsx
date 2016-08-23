import R from 'R'

module.exports = {
  path: R.My,
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./My'))
    })
  },
  indexRoute: { onEnter: (nextState, replace) => replace(R.MyNovelList) },
  childRoutes: [
    require('./routes/NovelList'),
    require('./routes/addnovel'),
    require('./routes/NovelEdit'),
    require('./routes/NovelSectionAdd'),
    require('./routes/NovelSectionEdit'),
  ],
}
