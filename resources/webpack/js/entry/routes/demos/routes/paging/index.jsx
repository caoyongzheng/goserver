module.exports = {
  path: 'paging',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Paging'))
    })
  },
}
