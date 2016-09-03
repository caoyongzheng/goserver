import R from 'R'
module.exports = {
  path: R.Blog.pathname,
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Blog'))
    })
  },
  indexRoute: { onEnter: (nextState, replace) => replace(R.BlogIndex.pathname) },
  childRoutes: [
    require('./routes/BlogEdit'),
    require('./routes/BlogIndex'),
    require('./routes/BlogNew'),
    require('./routes/BlogView'),
  ],
}
