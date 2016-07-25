import React from 'react'

import InputStyle from 'InputStyle'
import css from './SignUp.scss'
import { signUp } from 'LoginAction'

class SignUp extends React.Component {
  state = {
    username: '',
    password: '',
    name: '',
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
  handleName = (e) => {
    this.setState({
      name: e.target.value,
    })
  }
  handleSignUp = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const user = {
      username: this.state.username,
      password: this.state.password,
      name: this.state.name,
    }
    const successHandle = () => location.reload()
    const failHandle = (result) => console.log(result.desc)
    const errHandle = (err) => console.log(err)
    signUp(user, { successHandle, failHandle, errHandle })
  }
  render() {
    const { username, password, name } = this.state
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
          <label htmlFor="form-name" />
          <input
            key={'name'}
            type="text"
            name="form-name"
            placeholder={'name...'}
            style={InputStyle.normal}
            value={name}
            onChange={this.handleName}
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
export default SignUp
