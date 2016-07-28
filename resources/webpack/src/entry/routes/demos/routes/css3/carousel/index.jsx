module.exports = {
  path: 'css3/carousel',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/Carousel'))
    })
  },
}
