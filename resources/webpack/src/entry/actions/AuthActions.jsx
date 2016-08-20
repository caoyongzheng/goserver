import C from './Consants'
export default function AuthActions({ dispatch }) {
  function onLogin() {
    $.ajax({
      url: '/api/user/session/user',
      success: (result) => {
        if (result.success) {
          const user = result.data
          dispatch({
            type: C.Login,
            state: { logStatus: 'LOGIN' },
            data: { user },
          })
        } else if (!result.success) {
          dispatch({
            type: C.Logout,
            state: { logStatus: 'LOGOUT' },
            data: { user: {} },
          })
        }
      },
    })
  }
  function onLogout() {
    $.ajax({
      url: '/api/user/signout',
      success: (result) => {
        if (result.success) {
          dispatch({
            type: C.Logout,
            state: { logStatus: 'LOGOUT' },
            data: { user: {} },
          })
        } else if (!result.success) {
          $.notify(result.desc)
        }
      },
    })
  }
  return { onLogin, onLogout }
}
