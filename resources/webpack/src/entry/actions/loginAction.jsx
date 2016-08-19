import request from 'superagent'

export function signIn(obj, { successHandle, failHandle, errHandle }) {
  request
    .post('/api/user/signin')
    .send(obj)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .then((res) => {
      const result = JSON.parse(res.text)
      if (result.success && successHandle) {
        successHandle(result)
      } else if (!result.success && failHandle) {
        failHandle(result)
      }
    }, (err) => {
      if (errHandle) {
        errHandle(err)
      }
    })
}

export function signUp(obj, { successHandle, failHandle, errHandle }) {
  request
    .post('/api/user/signup')
    .send(obj)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .then((res) => {
      const result = JSON.parse(res.text)
      if (result.success && successHandle) {
        successHandle(result)
      } else if (!result.success && failHandle) {
        failHandle(result)
      }
    }, (err) => {
      if (errHandle) {
        errHandle(err)
      }
    })
}
