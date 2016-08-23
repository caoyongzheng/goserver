import R from 'R'

module.exports = {
  path: R.NovelSectionAdd,
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./apps/NovelSectionAddApp'))
    })
  },
}
