import request from 'superagent'

export function setHeaderIcon(filename, { successHandle, failHandle, errHandle }) {
  request.put('/api/user/headerIcon')
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .send({ filename })
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
