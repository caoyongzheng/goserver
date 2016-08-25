import React, { PropTypes } from 'react'
import { signUp } from 'LoginAction'
import InputStyle from 'InputStyle'
import css from './SignUp.scss'

class SignUp extends React.Component {
  state = {
    username: '',
    password: '',
  }
  handleUsername = (e) => {
    this.setState({
      username: e.target.value,
    })
  }
  handlePassword = (e) => {
    this.setState({
      password: e.target.value,
    })
  }
  handleSignUp = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const user = {
      username: this.state.username,
      password: this.state.password,
    }
    if (!user.username || !user.password) {
      $.notify('username and password can not be empty')
      return
    }
    const successHandle = () => {
      const { onLogin, onSignModalDisplay } = this.props
      onSignModalDisplay('None')
      onLogin()
    }
    const failHandle = (result) => console.log(result.desc)
    const errHandle = (err) => console.log(err)
    signUp(user, { successHandle, failHandle, errHandle })
  }
  render() {
    const { username, password } = this.state
    return (
      <form>
        <div className={css.formGroup}>
          <label htmlFor="form-username" />
          <input
            key={'username'}
            type="text"
            name="username"
            placeholder={'Username...'}
            style={InputStyle.normal}
            value={username}
            onChange={this.handleUsername}
          />
        </div>
        <div className={css.formGroup}>
          <label htmlFor="form-password" />
          <input
            key={'password'}
            type="password"
            name="password"
            placeholder={'Password...'}
            style={InputStyle.normal}
            value={password}
            onChange={this.handlePassword}
          />
        </div>
        <div className={css.formGroup}>
          <button className={css.button} onClick={this.handleSignUp}>
            {'注 册'}
          </button>
        </div>
      </form>
    )
  }
}
SignUp.propTypes = {
  onLogin: PropTypes.func.isRequired,
  onSignModalDisplay: PropTypes.func.isRequired,
}
export default SignUp
