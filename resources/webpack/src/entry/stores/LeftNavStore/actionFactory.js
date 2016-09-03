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
  function handleToggle() {
    dispatch({
      type: 'HandleToggle',
      state: { open: !getState().open },
    })
  }
  return { handleClose, handleOpen, handleToggle }
}
