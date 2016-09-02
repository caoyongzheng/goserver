export default function actionFactory({ dispatch, getState }) {
  function handleClose() {
    dispatch({
      type: 'HandleClose',
      state: { open: false },
    })
  }
  function handleOpen() {
    dispatch({
      type: 'HandleOpen',
      state: { open: true },
    })
  }
  return { handleClose, handleOpen }
}
