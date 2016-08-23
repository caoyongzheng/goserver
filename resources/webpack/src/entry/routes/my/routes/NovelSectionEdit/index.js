import R from 'R'

module.exports = {
  path: R.MyNovelSectionEdit,
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./apps/NovelSectionEditApp'))
    })
  },
}
