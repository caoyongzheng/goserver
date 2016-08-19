import R from 'R'

module.exports = {
  path: R.MyNovelEdit,
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./NovelEdit'))
    })
  },
}
