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

// login 获取当前会话用户
function login(callBack) {
  $.ajax({
    url: '/api/user/sessionuser',
    success: (user) => {
      const { username, role, headerIcon, id } = user
      const newState = { role: verifyRole(role) }
      if (headerIcon) { // 当前用户存在
        newState.headerIcon = imageURL(headerIcon)
      } else if (role > 0) { // 是登录用户，当没有头像，则设置默认头像
        newState.headerIcon = DefaultHeaderIcon
      }
      if (username) {
        newState.username = username
      }
      if (id) {
        newState.id = id
      }
      this.dispatch({
        type: 'Login',
        state: newState,
      })
      if (callBack) {
        callBack()
      }
    },
  })
}

// getCurrentUser 退出当前用户会话
function logout() {
  $.ajax({
    url: '/api/user/signout',
    success: (result) => {
      this.dispatch({
        type: 'Logout',
        state: {...initState},
      })
    },
  })
}

export default {
  login,
  logout,
}
