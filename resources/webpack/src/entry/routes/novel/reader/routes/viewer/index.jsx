module.exports = {
  path: 'viewer/:sectionID',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Viewer.jsx'))
    })
  },
}
