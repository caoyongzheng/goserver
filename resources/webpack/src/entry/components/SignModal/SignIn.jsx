import React, { PropTypes } from 'react'
import InputStyle from 'InputStyle'
import { signIn } from 'LoginAction'
import css from './SignIn.scss'

class SignIn extends React.Component {
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
  handleSignin = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const user = {
      username: this.state.username,
      password: this.state.password,
    }
    const successHandle = () => {
      const { onLogin, onSignModalDisplay } = this.props
      onSignModalDisplay('None')
      onLogin()
    }
    const failHandle = (result) => console.log(result.desc)
    const errHandle = (err) => console.log(err)
    signIn(user, { successHandle, failHandle, errHandle })
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
            name="form-password"
            placeholder={'Password...'}
            style={InputStyle.normal}
            value={password}
            onChange={this.handlePassword}
          />
        </div>
        <div className={css.formGroup}>
          <button className={css.button} onClick={this.handleSignin}>
            {'登 录'}
          </button>
        </div>
      </form>
    )
  }
}
SignIn.propTypes = {
  onLogin: PropTypes.func.isRequired,
  onSignModalDisplay: PropTypes.func.isRequired,
}
export default SignIn
