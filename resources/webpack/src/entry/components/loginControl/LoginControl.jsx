import React, { PropTypes, Component } from 'react'
import { withRouter } from 'react-router'

import css from './LoginControl.scss'
import cx from 'classnames'
import DefaultHeaderIcon from 'DefaultHeaderIcon'
import icons from './icons.json'
import Login from 'Login'
import SvgIcon from 'SvgIcon'
import { uploadImage } from 'ImageAction'
import { imageURL } from 'PathUtil'
import { setHeaderIcon } from 'UserAction'

// LoginControl 登录控制
class LoginControl extends Component {
  state = {
    hide: true,
  }
  setHide = (hide) => {
    this.setState({
      hide,
    })
  }
  clickSignIn = (e) => {
    e.preventDefault()
    e.stopPropagation()
    Login.showSignIn()
  }
  clickSignUp = (e) => {
    e.preventDefault()
    e.stopPropagation()
    Login.showSignUp()
  }
  handleFile = (e) => {
    const file = e.target.files[0]
    const successHandle = (result) => setHeaderIcon(result.data, {
      successHandle: () => this.props.login(),
      failHandle: (r) => $.notify(r.desc),
    })
    const failHandle = (result) => $.notify(result.desc)
    const errHandle = (err) => $.notify(err)
    uploadImage(file, { successHandle, failHandle, errHandle })
  }
  renderLoginBars = (loginState, store) => {
    if (loginState !== store.getData().loginStates.LOGOUT) {
      return null
    }
    return (
      <div className={css.item}>
        <a className={css.item} onClick={this.clickSignIn}>{'登录'}</a>
        <a className={css.item} onClick={this.clickSignUp}>{'注册'}</a>
      </div>
    )
  }
  renderUserInfo = (user, loginState, store, hide) => {
    if (loginState !== store.getData().loginStates.LOGIN) {
      return null
    }
    return (
      <ul>
        <li ref="userInfo" className={css.item} onMouseLeave={() => this.setHide(true)}>
          <a className={css.item}>
            <img
              src={imageURL(user.headerIcon) || DefaultHeaderIcon}
              className={css.headerImg}
              alt="userIcon"
            />
            <input
              type="file"
              name="image"
              className={css.upload}
              accept="image/*"
              onChange={this.handleFile}
            />
          </a>
          <div className={css.item} onClick={() => this.setHide(false)}>
            <a className={css.item}>
              {user.name}
            </a>
            <a className={css.item} style={{ padding: '5px' }}>
              <SvgIcon {...icons.arrowDown} />
            </a>
          </div>
          <ul className={cx(css.dropdown, { [css.hide]: hide })}>
            <li onClick={this.props.logout}>{'登出'}</li>
          </ul>
        </li>
      </ul>
    )
  }
  render() {
    const { style, user, loginState, store } = this.props
    const { hide } = this.state
    return (
      <div style={style}>
        {this.renderLoginBars(loginState, store)}
        {this.renderUserInfo(user, loginState, store, hide)}
      </div>
    )
  }
}

LoginControl.propTypes = {
  user: PropTypes.object,
  loginState: PropTypes.string,
  login: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  store: PropTypes.object.isRequired,
}

export default withRouter(LoginControl)
