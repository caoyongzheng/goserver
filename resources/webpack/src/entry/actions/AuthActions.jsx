export default function AuthActions({ setState, getData }) {
  function login() {
    $.ajax({
      url: '/api/user/session/user',
      success: (result) => {
        if (result.success) {
          const user = result.data
          setState({ user, loginState: getData().loginStates.LOGIN })
        } else if (!result.success) {
          setState({ user: {}, loginState: getData().loginStates.LOGOUT })
        }
      },
    })
  }
  function logout() {
    $.ajax({
      url: '/api/user/signout',
      success: (result) => {
        if (result.success) {
          setState({ user: {}, loginState: getData().loginStates.LOGOUT })
        } else if (!result.success) {
          $.notify(result.desc)
        }
      },
    })
  }
  return { login, logout }
}
