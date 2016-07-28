import request from 'superagent'

import { setState } from 'Stores'

export function getUser() {
  request
    .get('/api/user/session/user')
    .then((res) => {
      const result = JSON.parse(res.text)
      if (result.success) {
        const user = result.data
        setState('app', { user })
      } else if (!result.success) {
        setState('app', { user: {} })
      }
    }, (err) => {
      $.notify(err)
    })
}

export function signOut() {
  request
    .get('/api/user/signout')
    .then((res) => {
      const result = JSON.parse(res.text)
      if (result.success) {
        location.reload()
      } else if (!result.success) {
        $.notify(result.desc)
      }
    }, () => {
      location.reload()
    })
}

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
