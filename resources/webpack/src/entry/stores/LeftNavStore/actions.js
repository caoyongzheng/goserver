function handleClose() {
  this.dispatch({
    type: 'HandleClose',
    state: { open: false },
  })
}

function handleOpen() {
  this.dispatch({
    type: 'HandleOpen',
    state: { open: true },
  })
}

function handleToggle() {
  this.dispatch({
    type: 'HandleToggle',
    state: { open: !this.getState().open },
  })
}

export default { handleClose, handleOpen, handleToggle }
