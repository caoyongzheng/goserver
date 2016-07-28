module.exports = {
  path: 'blog',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./blog'))
    })
  },
  indexRoute: { onEnter: (nextState, replace) => replace('/blog/home') },
  childRoutes: [
    require('./routes/add/index'),
    require('./routes/edit/index'),
    require('./routes/home/index'),
    require('./routes/view/index'),
    require('./routes/myblog/index'),
  ],
}
