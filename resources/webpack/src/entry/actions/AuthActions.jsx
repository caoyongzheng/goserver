import C from './Consants'
import { Host } from 'PathUtil'
export default function AuthActions({ dispatch }) {
  function onLogin() {
    $.ajax({
      url: `${Host}/api/user/session/user`,
      success: (result) => {
        if (result.success) {
          const user = result.data
          user.logStatus = 'LOGIN'
          dispatch({
            type: C.Login,
            state: { logStatus: 'LOGIN', user },
          })
        } else if (!result.success) {
          dispatch({
            type: C.Logout,
            state: { logStatus: 'LOGOUT', user: { logStatus: 'LOGOUT' } },
          })
        }
      },
    })
  }
  function onLogout() {
    $.ajax({
      url: `${Host}/api/user/signout`,
      success: (result) => {
        if (result.success) {
          dispatch({
            type: C.Logout,
            state: { logStatus: 'LOGOUT', user: { logStatus: 'LOGOUT' } },
          })
        } else if (!result.success) {
          $.notify(result.desc)
        }
      },
    })
  }
  return { onLogin, onLogout }
}
