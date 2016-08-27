import React, { PropTypes, Component } from 'react'
import { withRouter } from 'react-router'

import css from './LoginControl.scss'
import cx from 'classnames'
import DefaultHeaderIcon from 'DefaultHeaderIcon'
import icons from './icons.json'
import SvgIcon from 'SvgIcon'
import { uploadImage } from 'ImageAction'
import { imageURL } from 'PathUtil'
import { setHeaderIcon } from 'UserAction'
import R from 'R'

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
    this.props.onSignModalDisplay('SignIn')
  }
  clickSignUp = (e) => {
    e.preventDefault()
    e.stopPropagation()
    this.props.onSignModalDisplay('SignUp')
  }
  handleFile = (e) => {
    const file = e.target.files[0]
    const successHandle = (result) => setHeaderIcon(result.data, {
      successHandle: () => this.props.onLogin(),
      failHandle: (r) => $.notify(r.desc),
    })
    const failHandle = (result) => $.notify(result.desc)
    const errHandle = (err) => $.notify(err)
    uploadImage(file, { successHandle, failHandle, errHandle })
  }
  renderLoginBars = (logStatus) => {
    if (logStatus !== 'LOGOUT') {
      return null
    }
    return (
      <div className={css.item}>
        <a className={css.item} onClick={this.clickSignIn}>{'登录'}</a>
        <a className={css.item} onClick={this.clickSignUp}>{'注册'}</a>
      </div>
    )
  }
  renderUserInfo = ({ headerIcon, username, userId, logStatus, hide }) => {
    if (logStatus !== 'LOGIN') {
      return null
    }
    return (
      <ul>
        <li ref="userInfo" className={css.item} onMouseLeave={() => this.setHide(true)}>
          <a className={css.item}>
            <img
              src={imageURL(headerIcon) || DefaultHeaderIcon}
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
              {username}
            </a>
            <a className={css.item}>
              <SvgIcon {...icons.arrowDown} />
            </a>
          </div>
          <ul className={cx(css.dropdown, { [css.hide]: hide })}>
            <li
              onClick={() => {
                this.setHide(true)
                this.props.router.push({ pathname: R.BlogIndex, query: { userId } })
              }}
            >
              {'我的博文'}
            </li>
            <li
              onClick={() => {
                this.setHide(true)
                this.props.onLogout()
              }}
            >
              {'登出'}
            </li>
          </ul>
        </li>
      </ul>
    )
  }
  render() {
    const { style, logStatus, headerIcon, username, userId } = this.props
    const { hide } = this.state
    return (
      <div style={style}>
        {this.renderLoginBars(logStatus)}
        {this.renderUserInfo({ headerIcon, username, userId, logStatus, hide })}
      </div>
    )
  }
}

LoginControl.propTypes = {
  userId: PropTypes.string,
  headerIcon: PropTypes.string,
  username: PropTypes.string,
  logStatus: PropTypes.string,
  onLogin: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  store: PropTypes.object.isRequired,
  onSignModalDisplay: PropTypes.func.isRequired,
}

export default withRouter(LoginControl)
