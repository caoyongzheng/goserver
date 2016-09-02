import initState from './initState'
import DefaultHeaderIcon from 'DefaultHeaderIcon'
import { imageURL } from 'PathUtil'

function verifyRole(role) {
  switch (role) {
    case 4:
      return 4
    case 2:
      return 2
    default:
      return 0
  }
}

export default function actionFactory({ dispatch, getState }) {
  // login 获取当前会话用户
  function login() {
    $.ajax({
      url: '/api/user/sessionuser',
      success: (user) => {
        const { username, role, headerIcon } = user
        const newState = { role: verifyRole(role) }
        if (headerIcon) { // 当前用户存在
          newState.headerIcon = imageURL(headerIcon)
        } else if (role > 0) { // 是登录用户，当没有头像，则设置默认头像
          newState.headerIcon = DefaultHeaderIcon
        }
        if (username) {
          newState.username = username
        }
        dispatch({
          type: 'Login',
          state: newState,
        })
      },
    })
  }

  // getCurrentUser 退出当前用户会话
  function logout() {
    $.ajax({
      url: '/api/user/signout',
      success: (result) => {
        dispatch({
          type: 'Logout',
          state: initState,
        })
      },
    })
  }
  return { login, logout }
}
