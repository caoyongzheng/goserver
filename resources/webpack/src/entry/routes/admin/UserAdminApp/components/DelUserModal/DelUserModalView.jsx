import React, { PropTypes } from 'react'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'

function DelUserModalView({ open, username, comfirmUsername,
  handleClose, handleSubmit, handleComfirmUsernameChange }) {
  const actions = [
    <FlatButton
      label="取消"
      primary
      onTouchTap={handleClose}
    />,
    <FlatButton
      label="删除"
      primary
      onTouchTap={handleSubmit}
      disabled={comfirmUsername !== username && !!username}
    />,
  ]
  return (
    <Dialog
      title="请确认，是否删除用户？"
      contentStyle={{ width: '400px' }}
      actions={actions}
      open={open}
      onRequestClose={handleClose}
    >
      {'请输入用户名:'}
      <div style={{ fontWeight: 'bold', color: '#000', marginTop: '10px' }}>
        {username}
      </div>
      <TextField
        id="username"
        hintText="用户名"
        style={{ marginTop: '10px' }}
        fullWidth
        value={comfirmUsername}
        onChange={(e) => handleComfirmUsernameChange(e.target.value)}
      /><br />
    </Dialog>
  )
}
DelUserModalView.propTypes = {
  open: PropTypes.bool.isRequired,
  username: PropTypes.string,
  comfirmUsername: PropTypes.string,
  handleClose: PropTypes.func.isRequired,
  handleComfirmUsernameChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
}
export default DelUserModalView
