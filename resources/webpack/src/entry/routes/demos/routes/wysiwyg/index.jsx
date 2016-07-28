module.exports = {
  path: 'wysiwyg',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Wysiwyg'))
    })
  },
}
