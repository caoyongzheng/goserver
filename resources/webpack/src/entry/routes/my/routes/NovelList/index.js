import R from 'R'

module.exports = {
  path: R.MyNovelList,
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./apps/NovelList'))
    })
  },
}
