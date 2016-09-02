export default function actionFactory({ dispatch, getState }) {
  // 取消
  function cancel() {
    dispatch({
      type: 'Cancel',
      state: { open: false },
    })
  }
  // 弹出登录框
  function onSignIn() {
    dispatch({
      type: 'OnSignIn',
      state: { open: true, type: 'SignIn' },
    })
  }
  // 弹出注册框
  function onSignUp() {
    dispatch({
      type: 'OnSignUp',
      state: { open: true, type: 'SignUp' },
    })
  }
  // 提交登录数据
  function submitSignIn(data, callback) {
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
          dispatch({
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
  return { cancel, onSignIn, onSignUp, submitSignIn, submitSignUp }
}
