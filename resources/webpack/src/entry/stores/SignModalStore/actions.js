// 取消
function cancel() {
  this.dispatch({
    type: 'Cancel',
    state: { open: false },
  })
}
// 弹出登录框
function onSignIn() {
  this.dispatch({
    type: 'OnSignIn',
    state: { open: true, type: 'SignIn' },
  })
}
// 弹出注册框
function onSignUp() {
  this.dispatch({
    type: 'OnSignUp',
    state: { open: true, type: 'SignUp' },
  })
}
// 提交登录数据
function submitSignIn(data, callback) {
  const { dispatch } = this
  $.ajax({
    type: 'POST',
    url: '/api/user/signin',
    data,
    success(result) {
      if (result.success) {
        dispatch({
          type: 'SubmitSignIn',
          state: {
            open: false,
          }
        })
        callback()
      } else {
        console.log(result.desc)
      }
    },
  })
}
// 提交注册数据
function submitSignUp(data, callback) {
  $.ajax({
    type: 'POST',
    url: '/api/user/signup',
    data,
    success(result) {
      if (result.success) {
        this.dispatch({
          type: 'SubmitSignUp',
          state: {
            open: false,
          }
        })
        callback()
      } else {
        console.log(result.desc)
      }
    },
  })
}
export default { cancel, onSignIn, onSignUp, submitSignIn, submitSignUp }
