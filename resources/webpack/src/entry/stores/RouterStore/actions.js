function initHistory(history) {
  if (!history) {
    throw 'history can not be empty'
  }
  this.dispatch({
    type: 'InitHistory',
    state: { history }
  })
}



function locationChange(location) {
  const { dispatch, getState } = this
  this.dispatch({
    type: 'LocationChange',
    state: { location },
  })
}

export default {
  initHistory,
  locationChange,
}
