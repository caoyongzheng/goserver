module.exports = {
  path: 'user',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./MyBlog'))
    })
  },
}
