import React, { PropTypes } from 'react'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'

function NewUserModalView({ open, username, password,
  handleClose, handleUsernameChange, handlePasswordChange, handleSubmit }) {
  const actions = [
    <FlatButton
      label="取消"
      primary
      onTouchTap={handleClose}
    />,
    <FlatButton
      label="保存"
      primary
      onTouchTap={handleSubmit}
    />,
  ]
  return (
    <Dialog
      title="新增用户"
      contentStyle={{ width: '400px' }}
      actions={actions}
      open={open}
      onRequestClose={handleClose}
    >
      <TextField
        hintText="用户名"
        fullWidth
        value={username}
        onChange={(e) => handleUsernameChange(e.target.value)}
      /><br />
      <TextField
        hintText="密码"
        fullWidth
        value={password}
        onChange={(e) => handlePasswordChange(e.target.value)}
      /><br />
    </Dialog>
  )
}
NewUserModalView.propTypes = {
  open: PropTypes.bool.isRequired,
  username: PropTypes.string,
  password: PropTypes.string,
  handleClose: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
}
export default NewUserModalView
