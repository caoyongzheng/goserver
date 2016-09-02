import R from 'R'

export default function actionFactory({ dispatch, getState }) {
  function setPage(pathname) {
    const currentPathname = getState().page.pathname
    if (pathname !== currentPathname) {
      dispatch({
        type: 'SetPage',
        state: { page: R.getPage(pathname) },
      })
    }
  }

  return { setPage }
}
