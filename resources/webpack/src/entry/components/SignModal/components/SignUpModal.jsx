import React, { PropTypes } from 'react'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'

class SignUpModal extends React.Component {
  state = {
    username: '',
    password: '',
  }
  onUsername = (e) => {
    this.setState({
      username: e.target.value,
    })
  }
  onPassword = (e) => {
    this.setState({
      password: e.target.value,
    })
  }
  submitSignIn = () => {
    const data = {
      username: this.state.username,
      password: this.state.password,
    }
    this.props.submitSignUp(data)
  }
  render() {
    const { username, password } = this.state
    const { open, cancel } = this.props
    const actions = [
      <FlatButton
        label="取消"
        primary
        onTouchTap={cancel}
      />,
      <FlatButton
        label="注册"
        primary
        onTouchTap={this.submitSignIn}
      />,
    ]
    return (
      <Dialog
        title="注册"
        open={open}
        contentStyle={{ width: '320px' }}
        actions={actions}
        onRequestClose={cancel}
      >
        <TextField
          id="username"
          hintText="username"
          fullWidth
          value={username}
          onChange={this.onUsername}
        /><br />
        <TextField
          id="password"
          hintText="password"
          type="password"
          fullWidth
          value={password}
          onChange={this.onPassword}
        /><br />
      </Dialog>
    )
  }
}

SignUpModal.propTypes = {
  open: PropTypes.bool.isRequired,
  cancel: PropTypes.func.isRequired,
  submitSignUp: PropTypes.func.isRequired,
}
export default SignUpModal
