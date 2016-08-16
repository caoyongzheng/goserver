import R from 'R'

module.exports = {
  path: R.my,
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./My'))
    })
  },
  indexRoute: { onEnter: (nextState, replace) => replace(R.novels) },
  childRoutes: [
    require('./routes/novels'),
    require('./routes/addnovel'),
  ],
}
